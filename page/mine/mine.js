// page/mine/mine.js
const app = getApp();
const { $Message } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    privateNum: 0, //文章数量
    openNum: 0,
    list: [],
    status: 0,
    showView: false,
    cid: 0, // 文章ID
    status: 0, // 文章状态
    isPrivate: false,
    visible5: false, 
    visible4: false, //
    visible3: false, //撤销审核
    visible2: false, //删除文章Modal
    visible1: false, //提交审核Modal
    visible: false,// Modal 是否显示
    visible_2: false,
    visible_3: false, // 审核通过 非公开文章
    visible_4: false, // 审核未通过 公开文章
    showtype: false, //显示文字类型下拉框
    showstatus: false, // 显示文章状态下拉框
    showtime: false, //显示 时间下拉框
    arrows: "unfold", // 文章类型箭头
    arrows1: "unfold", // 文章状态箭头
    arrows2: "unfold", // 时间排序箭头
    articleType: -1, // 文章类型
    articleStatus: -1, //文章状态
    isDesc: false, //时间排序
    types: [],
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
    ],
    actions2: [
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
        name: '撤销审核'
      }
    ],
    actions3: [
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
        name: '设为公开文章'
      }
    ],
    actions4: [
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
        name: '设为私密文章'
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
  getArticlerList: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取文章列表数据
    wx.request({
      url: app.globalData.url + '/article/v1/getArticlerListByUser',
      method: 'GET',
      data: {
        "page": 1,
        "pageSize": 10,
        "isPrivate": e,
        "userId": app.globalData.user.userId,
        "type": that.data.articleType,
        "status": that.data.articleStatus,
        "isDesc": that.data.isDesc
      },
      success: res => {
        console.log("我的文章列表返回数据 ----> ", res);
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data.records
          })
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

    /**
     * 获取文章数量
     */
    wx.request({
      url: app.globalData.url + '/article/v1/getArticleCount',
      method: "GET",
      data: {
        "userId": app.globalData.user.userId,
        "type": that.data.articleType,
        "status": that.data.articleStatus
      },
      success: res => {
        console.log("获取到文章数量", res);
        if (res.data.code == 200) {
          that.setData({
            privateNum: res.data.data.privateNum,
            openNum: res.data.data.openNum
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
    this.hidenNeck();
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
    this.hidenNeck();
  },

  /**
   * 操作点击事件
   */
  clickOp: function (e) {
    console.log("click event ", e.currentTarget.dataset);
    this.setData({
      cid: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status
    })
    // var that = this;
    // if (that.data.cid == e.currentTarget.dataset.id) {
    //   that.setData({
    //     // showView: (!that.data.showView)
    //     cid: 0
    //   })
    // } else {
    //   that.setData({
    //     // showView: (!that.data.showView)
    //     cid: e.currentTarget.dataset.id
    //   })
    // }
  },

  /**
   * 点击item 弹出modal事件
   */
  clickItem: function (e) {
    var that = this;
    this.setData({
      cid: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status,
      isPrivate: e.currentTarget.dataset.isprivate
    })
    console.log("click item event ", e.currentTarget.dataset);
    // new Promise(function (resolve, reject) {
    //   wx.request({
    //     url: app.globalData.url + "/article/v1/getArticleStatus/" + that.data.cid,
    //     method: "GET",
    //     success: res => {
    //       console.log("获取当前文章状态", res);
    //       if (res.data.code == 200) {
    //         resolve(res.data.data.status);
    //       }
    //     }
    //   })
    // }).then(function (e) {
    //   console.log("--------- status-------------", e);
    //   console.log("------------actions--------", that.data.actions)
    //   let actions = that.data.actions;
    //   // if(e == 1) {
    //   //  actions.splice(3, 1, "撤销审核");
    //   // }
    //   that.setData({
    //     visible: true,
    //     actions: actions
    //   });
    // })
    
    //未审核 审核未通过
    if (that.data.status == 0 || that.data.status == 3) {
      that.setData({
        visible: true
      });
    }
    // 审核中
    if (that.data.status == 1) {
      that.setData({
        visible_2: true
      });
    }
    // 审核已通过
    if (that.data.status == 2) {
      if(that.data.isPrivate) {
        that.setData({
          visible_3: true
        });
      } else {
        that.setData({
          visible_4: true
        });
      }
    }

  },

  /**
   * 点击Modal 中的按钮
   */
  handleClick: function (e) {
    console.log("Modal 返回值 ", e);
    const op = e.detail.index;
    const flag = e.currentTarget.dataset.flag;
    // 预览
    if (op == 0) {
      wx.navigateTo({
        url: '../arcticle/detail/detail?articleId=' + this.data.cid,
      })
    }
    //编辑
    if (op == 1) {

    }
    //删除
    if (op == 2) {
      this.setData({
        visible2: true
      })
    }
    //提交审核
    if (flag == "sheet1") {
      if (op == 3) {
        this.setData({
          visible1: true
        })
      }
    }
    //撤销审核
    if (flag == "sheet2") {
      if (op == 3) {
        this.setData({
          visible3: true
        })
      }
    }
    //设置成公开文章
    if (flag == "sheet3") {
      if (op == 3) {
        this.setData({
          visible4: true
        })
      }
    }
    //设置成私密文章
    if (flag == "sheet4") {
      if (op == 3) {
        this.setData({
          visible5: true
        })
      }
    }

    //取消Modal
    if (op == 4) {
      this.setData({
        visible: false
      })
    }
  },

  /**
   * 获取当前文章状态
   */
  // getArticleStatus: function (e) {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.url + "/article/v1/getArticleStatus/" + that.data.cid,
  //     method: "GET",
  //     success: res => {
  //       console.log("获取当前文章状态", res);
  //       if (res.data.code == 200) {
  //         return res.data.data.status;
  //       }
  //     }
  //   })
  // },

  //删除文章
  deleteArticle: function (e) {
    var that = this;
    wx.showLoading({
      title: '删除中',
    });

    wx.request({
      url: app.globalData.url + '/article/v1/deleteArticle/' + that.data.cid + "/" + app.globalData.user.userId,
      method: "DELETE",
      success: res => {
        if (res.data.code == 200) {
          $Message({
            content: '删除成功',
            type: 'success'
          });
          this.setData({
            visible: false,
            visible2: false
          });
          that.onLoad();
        }
        if (res.data.code == 500) {
          $Message({
            content: "网络异常，请稍后再试",
            type: 'error'
          });
        }
      },
      fail: res => {
        $Message({
          content: "网络异常，请稍后再试",
          type: 'error'
        });
      }
    })
  },

  /**
   * 关闭提交审核Modal
   */
  handleClose1: function (e) {
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

  /**
   * 关闭撤销审核Modal
   */
  handleClose3: function (e) {
    this.setData({
      visible3: false
    })
  },

  //关闭设置公开
  handleClose4: function (e) {
    this.setData({
      visible4: false
    })
  },

  //设置成私密
  handleClose5: function (e) {
    this.setData({
      visible5: false
    })
  },

  handleClose: function (e) {
    this.setData({
      visible: false,
      visible_2: false,
      visible_3: false,
      visible_4: false
    })
  },

  /**
   * 提交审核
   */
  handleSubmit: function (e) {
    var that = this;
    wx.showLoading({
      title: '提交中'
    })
    wx.request({
      url: app.globalData.url + '/article/v1/submitCheck/' + that.data.cid,
      method: "GET",
      success: res => {
        console.log("---------->", res);
        if (res.data.code == 200) {
          // wx.showToast({
          //   title: "提交成功",
          //   icon: "success"
          // });
          $Message({
            content: '提交审核成功',
            type: 'success'
          });
          this.setData({
            visible: false,
            visible1: false
          });
          that.onLoad();
        }
        if (res.data.code == 500) {
          $Message({
            content: res.data.msg,
            type: 'error'
          });
          this.setData({
            visible1: false
          })
        }
      },
      fail: res => {
        $Message({
          content: "网络异常，请稍后再试",
          type: 'error'
        });
      }
    })
  },

  /**
   * 撤销文章审核
   */
  handleSubmit2: function(e) {
    var that = this;
    wx.showLoading({
      title: '提交中'
    });

    wx.request({
      url: app.globalData.url + "/article/v1/repealCheck/" + that.data.cid,
      method: "PUT",
      success: res => {
        if (res.data.code == 200) {
          $Message({
            content: '撤销审核成功',
            type: 'success'
          });
          this.setData({
            visible_2: false,
            visible3: false
          });
          that.onLoad();
        }
        if (res.data.code == 500) {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: "none"
          // });
          $Message({
            content: res.data.msg,
            type: 'error'
          });
          this.setData({
            visible3: false
          })
        }
      },
      fail: res => {
        $Message({
          content: "网络异常，请稍后再试",
          type: 'error'
        });
      }
    })
  },

  /**
   * 设置文章公开
   */
  handleSubmit3: function (e) {
    this.setIsPrivate(0);
  },

  /**
   * 设置文章私密
   */
  handleSubmit4: function (e) {
    this.setIsPrivate(1);
  },

  /**
   * 设置文章私有
   */
  setIsPrivate: function(e) {
    var that = this;
    wx.showLoading({
      title: '提交中'
    });

    wx.request({
      url: app.globalData.url + "/article/v1/setIsPrivate/" + that.data.cid + "/" + e,
      method: "PUT",
      success: res => {
        if (res.data.code == 200) {
          $Message({
            content: '设置成功',
            type: 'success'
          });
          this.setData({
            visible_3: false,
            visible4: false,
            visible_4: false,
            visible5: false
          });
          that.onLoad();
        }
        if (res.data.code == 500) {
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: "none"
          // });
          $Message({
            content: res.data.msg,
            type: 'error'
          });
          this.setData({
            visible3: false
          })
        }
      },
      fail: res => {
        $Message({
          content: "网络异常，请稍后再试",
          type: 'error'
        });
      }
    })
  },

  /**
   * 确认删除文章
   */
  handleSubmit1: function (e) {
    this.deleteArticle();
  },
  
  /**
   * 显示文字类型
   */
  showType: function(e) {
    const that = this;
    wx.request({
      url: app.globalData.url + '/dict/v1/getDictByKey/article_type_',
      method: "GET",
      success: res => {
        console.log("请求下拉列表返回数据==>", res);
        that.setData({
          types: res.data.data.result
        });
      }
    })
    this.setData({
      showtype: !this.data.showtype,
      showstatus: false,
      showtime: false
    })
    if (this.data.showtype) {
      this.setData({
        arrows: "packup"
      })
    } else {
      this.setData({
        arrows: "unfold"
      })
    }
  },
  /**
   * 显示文章状态
   */
  showStatus: function(e) {
    this.setData({
      showstatus: !this.data.showstatus,
      showtype: false,
      showtime: false
    })
    if (this.data.showstatus) {
      this.setData({
        arrows1: "packup"
      })
    } else {
      this.setData({
        arrows1: "unfold"
      })
    }
  },


  /**
   * 点击时间排序
   */
  showTime: function(e) {
    this.setData({
      showtime: !this.data.showtime,
      showstatus: false,
      showtype: false
    })
    if (this.data.showtime) {
      this.setData({
        arrows2: "packup"
      })
    } else {
      this.setData({
        arrows2: "unfold"
      })
    }
  },

  /**
   * 点击其它位置也能关闭下拉框
   */
  hidenNeck: function(e) {
    this.setData({
      showtype: false,
      showstatus: false,
      showtime: false
    })
    if (this.data.showtype) {
      this.setData({
        arrows: "packup",
        arrows1: "packup",
        arrows2: "packup"
      })
    } else {
      this.setData({
        arrows: "unfold",
        arrows1: "unfold",
        arrows2: "unfold"
      })
    }
  },

  /**
   * 点击文字类型
   */
  clickType: function(e) {
    this.setData({
      articleType: e.currentTarget.dataset.dictid
    })
    this.onLoad();
    this.hidenNeck();
  },

  /**
   * 点击文章状态
   */
  clickStatus: function(e) {
    this.setData({
      articleStatus: e.currentTarget.dataset.status
    })
    this.onLoad();
    this.hidenNeck();
  },

  /**
   * 点击时间排序
   */
  clickTime: function(e) {
    this.setData({
      isDesc: e.currentTarget.dataset.isdesc
    });
    this.onLoad();
    this.hidenNeck();
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
    this.onLoad();
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