const app = getApp();
// page/arcticle/arcticle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 1000,
    title: '配置中关闭合法域名'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    //获取轮播图url
    wx.request({
      url: app.globalData.url + '/banner/v1/getBannerList',
      method: 'GET',
      success: res => {
        console.log(res);
        var imgUrls = [];
        if(res.data.code == 200) {
          for(var i=0; i < res.data.data.length; i++) {
            imgUrls.push(res.data.data[i].url);
          }
          that.setData({
            imgUrls: imgUrls
          })
        }
      }
    })
    //获取文章列表数据
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