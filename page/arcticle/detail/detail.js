const app = getApp();
const regeneratorRuntime = require('../../../utils/runtime.js')
var WxParse = require('../../../wxParse/wxParse.js');
const { $Message } = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    praise: "praise",
    praiseNum: 0,
    message: []
  },

  /**
   * 点赞事件
   */
  clickPraise(e) {
    if (this.data.praise == "praise") {
      this.setData({
        praise: "praise_fill",
        praiseNum: this.data.praiseNum + 1
      });
    } else {
      this.setData({
        praise: "praise",
        praiseNum: this.data.praiseNum - 1
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    //根据文章ID 获取文章详细信息
    wx.request({
      url: app.globalData.url + '/article/v1/getArticlerById/' + options.articleId + '/' + app.globalData.user.userId,
      method: 'GET',
      success: res => {
        if(res.data.code == 200) {
          var createTime = res.data.data.detail.createTime;
          res.data.data.detail.createTime = createTime.substring(0, 10);
          console.log(res.data.data.detail);
          that.setData({
            detail: res.data.data.detail,
            praiseNum: res.data.data.detail.praiseNum,
          })
          if (res.data.data.isPraise == 1) {
            that.setData({
              praise: 'praise_fill'
            })
          }
          var article = res.data.data.detail.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        } else {
          $Message({
            content: "网络异常，请稍后再试",
            type: 'error'
          });
        }
      },
      fail: res => {
        wx.hideLoading();
        $Message({
          content: "网络异常，请稍后再试",
          type: 'error'
        });
      }
    })

    //获取留言
    wx.request({
      url: app.globalData.url + '/message/v1/list/' + options.articleId,
      method: 'GET',
      success: res => {
        console.log("留言 -------->", res);
        if(res.data.code == 200) {
          that.setData({
            message: res.data.data.records
          });
        } else {
          $Message({
            content: "网络异常，请稍后再试",
            type: 'error'
          });
        }
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading();
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
    var that = this;
    console.log("----close detail page------", that.data.detail.articleId);
    wx.request({
      url: app.globalData.url + '/article/v1/praiseArticle/' + that.data.praiseNum + '/' + that.data.detail.articleId + '/' + app.globalData.user.userId,
      method: 'GET',
      success: res => {
        console.log("------", res);
      }
    })

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