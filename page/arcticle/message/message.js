const app = getApp();
const { $Message } = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    articleId: "",
    visible: false,
    text: ""
  },

  /**
   * 输入框失去焦点事件
   */
  blurHandle (e) {
    this.setData({
      text: e.detail.value
    })
  },

  /**
   * 保存留言
   */
  handleClick (e) {
    this.setData({
      visible: true
    });
  },

  handleClose (e) {
    this.setData({
      visible: false
    });
  },

  /**
   * 提交留言
   */
  handleSubmit (e) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/message/v1/saveMessage',
      method: 'POST',
      data: {
        'articleId': that.data.articleId,
        'userId': app.globalData.user.userId,
        'msgContent': that.data.text
      },
      success: res => {
        console.log(res);
        if(res.data.code == 200) {
          that.handleClose();
          $Message({
            content: "保存留言成功",
            type: 'success'
          });
          // wx.navigateBack({
          //   delta: 1
          // })
          wx.redirectTo({
            url: '../detail/detail?articleId=' + that.data.articleId
          })
        } else {
          that.handleClose();
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
    this.setData({
      title: options.title,
      articleId: options.articleId
    });
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