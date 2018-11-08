// page/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: '<p class="xing-p">不谈琐碎的细节，突出主题，颜色运用。这些都是行为，这些行为是纹身师的能力表达，而他们要达到一个目标：</p><img class="xing-img" style="width: 100%" src="https://www.uooyoo.com/img2017/2/15/2017021560909533.jpg" _height="0.61983" _uploaded="true"></img>',
    url: app.globalData.url + '/oss/v1/uploadFile',
    filename: 'file',
    keyChain: 'msg',
    title: 'TODO', //文章标题
    articleType: 'TODO',
    image: '',
    article: {
      "articleType": 0,
      "content": null,
      "createUser": null,
      "image": null,
      "title": null
    }
  },

  finish: function(e) {
    console.log(e.detail.content);
    const that = this;
    //组装数据
    that.setData({
      'article.createUser': app.globalData.user.userId,
      'article.title': that.data.title,
      'article.articleType': that.data.articleType,
      'article.content': e.detail.content,
      'article.image': that.data.image
    })
    wx.request({
      url: app.globalData.url + '/article/v1/saveArticle',
      method: 'POST',
      data: that.data.article,
      success: res => {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})