// page/arcticle/message/message.js
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
    console.log("---------------------", this.data.text);
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