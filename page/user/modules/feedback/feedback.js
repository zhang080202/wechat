const app = getApp();
const { $Message } = require('../../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },

  blurHandle (e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 提交意见
   */
  handleClick (e) {
    const that = this;
    wx.request({
      url: app.globalData.url + '/suggestion',
      method: 'POST',
      data: {
        "content": that.data.content,
        "userId": app.globalData.user.userId
      },
      success: res => {
        if (res.data.code == 200) {
          $Message({
            content: "保存留言成功",
            type: 'success'
          });
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
          
        } else {
          $Message({
            content: res.data.msg,
            type: 'error'
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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