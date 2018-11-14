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

    //获取文章列表数据
    wx.request({
      url: app.globalData.url + '/article/v1/getArticlerList/' + 1 + '/' + 10,
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

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 操作点击事件
   */
  clickOp: function (e) {
    console.log("clicl event ", e.currentTarget.dataset.id);
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
    //提交审核
    if(op == 2) {
      this.setData({
        visible1: true
      })
    }
    //取消Modal
    if(op == 3) {
      this.setData({
        visible: false
      })
    }
  },

  /**
   * 关闭提交审核Modal
   */
  handleClose1: function(e) {
    this.setData({
      visible1: false
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
    wx.showLoading({
      title: '提交中'
    })
    wx.request({
      url: '',
      method: "GET",
      success: res => {

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