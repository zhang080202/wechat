// page/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    articleNum: 0, //文章数量
    list: [],
    status: 0,
    showView: false,
    cid: 0,
    visible2: false, //删除文章Modal
    visible1: false, //提交审核Modal
    visible: false,// Modal 是否显示
    actions: [
        {
          name: '预览'
        },
        {
          name: '编辑'
        },
        {
          name: '删除'
        },
        {
          name: '提交审核'
        }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    if (that.data.currentTab == 0) {
      //私密文章
      this.getArticlerList(1);
    } else if (that.data.currentTab == 1) {
      //公开文章
      this.getArticlerList(0);
    }
  },

  /**
   * 获取文章列表
   */
  getArticlerList: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取文章列表数据
    wx.request({
      url: app.globalData.url + '/article/v1/getArticlerListByUser/' + 1 + '/' + 10 + "/" + e + "/" + app.globalData.user.userId,
      method: 'GET',
      success: res => {
        console.log("我的文章列表返回数据 ----> ", res);
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data.records,
            articleNum: res.data.data.total
          })
        }
        if (res.data.code == 500) {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none'
          })
        }
        //请求完成关闭 loading
        wx.hideLoading();
      },
      fail: res => {
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 滑动切换tab
   */
  bindChange: function (e) {
    console.log("滑动切换tab", e);
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (that.data.currentTab == 0) {
      //私密文章
      this.getArticlerList(1);
    } else if (that.data.currentTab == 1) {
      //公开文章
      this.getArticlerList(0);
    }
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    console.log("点击tab切换", e);

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    if (that.data.currentTab == 0) {
      //私密文章
      this.getArticlerList(1);
    } else if (that.data.currentTab == 1) {
      //公开文章
      this.getArticlerList(0);
    }
  },

  /**
   * 操作点击事件
   */
  clickOp: function (e) {
    console.log("click event ", e.currentTarget.dataset.id);
    var that = this;
    if (that.data.cid == e.currentTarget.dataset.id) {
      that.setData({
        // showView: (!that.data.showView)
        cid: 0
      })
    } else {
      that.setData({
        // showView: (!that.data.showView)
        cid: e.currentTarget.dataset.id
      })
    }
  },

  /**
   * 点击item 弹出modal事件
   */
  clickItem: function(e) {
    this.setData({
      visible: true,
      cid: e.currentTarget.dataset.id
    })
  },

  /**
   * 点击Modal 中的按钮
   */
  handleClick: function(e) {
    console.log("Modal 返回值 ", e);
    const op = e.detail.index;
    // 预览
    if(op == 0) {
      wx.navigateTo({
        url: '../arcticle/detail/detail?articleId=' + this.data.cid,
      })
    }
    //编辑
    if(op == 1) {

    }
    //删除
    if(op == 2) {
      this.setData({
        visible2: true
      })
    }
    //提交审核
    if(op == 3) {
      this.setData({
        visible1: true
      })
    }
    //取消Modal
    if(op == 4) {
      this.setData({
        visible: false
      })
    }
  },

  //删除文章
  deleteArticle: function(e) {
    var that = this;
    wx.showLoading({
      title: '删除中',
    });

    wx.request({
      url: app.globalData.url + '/article/v1/deleteArticle/' + that.data.cid + "/" + app.globalData.user.userId,
      method: "DELETE",
      success: res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          this.setData({
            visible: false,
            visible2: false
          });
          that.onLoad();
        }
        if (res.data.code == 500) {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none'
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 关闭提交审核Modal
   */
  handleClose1: function(e) {
    this.setData({
      visible1: false
    })
  },

  /**
   * 关闭删除Modal
   */
  handleClose2: function (e) {
    this.setData({
      visible2: false
    })
  },

  handleClose: function (e) {
    this.setData({
      visible: false
    })
  },

  /**
   * 提交审核
   */
  handleSubmit: function(e) {
    var that = this;
    wx.showLoading({
      title: '提交中'
    })
    wx.request({
      url: app.globalData.url + '/article/v1/submitCheck/' + that.data.cid,
      method: "GET",
      success: res => {
        console.log("---------->", res);
        if(res.data.code == 200) {
          wx.showToast({
            title: "提交成功",
            icon: "success"
          });
          this.setData({
            visible: false,
            visible1: false
          });
          that.onLoad();
        }
        if (res.data.code == 500) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          });
          this.setData({
            visible1: false
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: "网络异常，请稍后再试",
          icon: "none"
        })
      }
    })
  },

  /**
   * 确认删除文章
   */
  handleSubmit1: function(e) {
    this.deleteArticle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})