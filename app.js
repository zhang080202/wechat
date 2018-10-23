
App({
  onLaunch(opts) {
    console.log('App Launch', opts)
  },//dd
  globalData: {
    hasLogin: false,
    openid: null,
    url: 'http://192.168.0.10/'
  }
})
