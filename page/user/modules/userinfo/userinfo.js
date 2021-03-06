const app = getApp();
const { $Message } = require('../../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    birthday: '1970-01-01',
    startDate: '1970-01-01',
    endDate: '2018-10-30'
  },

  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },



  /**
   * 提交基本信息表单至服务器
   */
  formSubmit: function(e) {
    var that = this;
    if (that.data.user.phone.length == 0) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function() {
        wx.hideToast();
      }, 1000);
      return;
    }
    //组装数据
    that.setData({
      'user.name': that.data.name,
      'user.gender': that.data.gender,
      'user.phone' : that.data.phone,
      'user.birthday': that.data.birthday
    })
    console.log(that.data.user);
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 5000,
      mask: true,
      success: function () {
        wx.hideToast();
        wx.request({
          url: app.globalData.url + '/user/v1/saveUserInfo',
          method: 'POST',
          data: that.data.user,
          success: res => {
            if(res.data.code == 500) {
              $Message({
                content: res.data.msg,
                type: 'error'
              });
              setTimeout(function () {
                wx.hideToast();
              }, 1000);
            }
            if(res.data.code == 200) {
              $Message({
                content: '保存成功',
                type: 'success'
              });
              
              setTimeout(function () {
                wx.hideToast();
              }, 1000);
              //返回上一级页面
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          },
          fail: res => {
            $Message({
              content: "网络异常，请稍后再试",
              type: 'error'
            });
          }
        })
      }
    })
  },

  phoneBlur: function(e) {
    this.setData({
      'user.phone': e.detail.value
    })
  },

  genderChange: function (e) {
    this.setData({
      'user.gender': e.detail.value
    })
  }, 

  nameBlur: function(e) {
    this.setData({
      'user.name': e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    /**
     * 根据用户ID 获取用户信息
     */
    wx.request({
      url: app.globalData.url + '/user/v1/queryUserById',
      method: 'GET',
      data: {
        userId: app.globalData.user.userId
      },
      success: res => {
        that.setData({
          user: res.data.data,
          birthday: res.data.data.birthday
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