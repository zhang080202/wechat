
App({
  onLaunch(opts) {
    console.log('App Launch', opts)

    var that = this;
    new Promise(function (resolve, reject) {
      wx.getUserInfo({
        success: res => {
          console.log(res);
          that.globalData.userInfo = res.userInfo;
          resolve(that.globalData.userInfo);
        },
        fail: res => {
          console.log('wx.getUserInfo is fail!!');
        }
      })
    }).then(function (e) {
      //登陆
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: that.globalData.url + '/user/v1/userLogin',
              method: 'GET',
              data: {
                code: res.code,
                userInfo: e
              },
              success: ret => {
                that.globalData.user = ret.data.data;
                if (that.globalData.userInfo != null) {
                  console.log('login success !!');
                  console.log('user ', that.globalData.user);
                  that.globalData.hasLogin = true;
                }
              }
            })
          }
        }
      })
    })
   
  },
  globalData: {
    hasLogin: false,
    userInfo: null,
    user: {},
    openid: null,
    url: 'https://192.168.2.111/article'
    // url: 'https://www.feigly.top/article'
    // url: 'http://192.168.0.19/article'
    // url: 'http://192.168.31.233/article'
  }
})
