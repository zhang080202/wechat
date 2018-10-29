// page/user/user.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasLogin: false,
    list: [
      {
        id: 'userinfo',
        name: '个人信息',
        page: 'userinfo'
      },
      {
        id: '',
        name: '我的审核',
        page: ''
      },
      {
        id: '',
        name: '意见反馈',
        page: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasLogin: app.globalData.hasLogin
    });
    //获取用户授权信息
    // wx.getSetting({
    //   success: res => {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success: res => {

    //         }
    //       })
    //     }
    //   }
    // })

    this.setData({
      userInfo: app.globalData.userInfo,
      hasLogin: app.globalData.hasLogin
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

  },

  getUserInfo: function (e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.hasLogin = true;
    this.setData({
      userInfo: e.detail.userInfo,
      hasLogin: true
    })
  }
})