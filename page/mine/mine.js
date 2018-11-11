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
    cid: 0
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
    that.setData({ currentTab: e.detail.current });

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
  clickOp: function(e) {
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
        cid : e.currentTarget.dataset.id
      })
    }
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