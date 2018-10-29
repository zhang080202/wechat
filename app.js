
App({
  onLaunch(opts) {
    console.log('App Launch', opts)

    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res);
        res.userInfo = that.globalData.userInfo;
      }
    })
    //登陆
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: that.globalData.url + '/user/v1/queryUserByCode',
            method: 'GET',
            data: {
              code: res.code,
              userInfo: that.globalData.userInfo
            },
            success: ret => {
              that.globalData.user = ret.data.data;
              that.globalData.hasLogin = true;
            }
          })
        }
      }
    })
  },
  globalData: {
    hasLogin: false,
    userInfo: null,
    user: {},
    openid: null,
    url: 'http://192.168.31.233:8080/article'
  }
})
