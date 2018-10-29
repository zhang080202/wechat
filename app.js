
App({
  onLaunch(opts) {
    console.log('App Launch', opts)
  },
  globalData: {
    hasLogin: false,
    userInfo: null,
    openid: null,
    url: 'http://192.168.31.233:8080/article'
  }
})
