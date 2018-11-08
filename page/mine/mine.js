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
    title: '', //文章标题
    articleType: 0, // 文章类型
    image: '', // 上传的标题图片ID
    types: [], // 文章类型
    index: [],
    files: [],//标题图片
    indexs: 0,
    article: {
      "articleType": 0,
      "content": null,
      "createUser": null,
      "image": null,
      "title": null
    }
  },

  finish: function(e) {
    console.log(e);
    const that = this;
    //组装数据
    that.setData({
      'article.createUser': app.globalData.user.userId,
      'article.title': that.data.title,
      'article.articleType': that.data.articleType,
      'article.content': e.detail.content,
      'article.image': that.data.image
    })
    // wx.request({
    //   url: app.globalData.url + '/article/v1/saveArticle',
    //   method: 'POST',
    //   data: that.data.article,
    //   success: res => {
    //     console.log(res);
    //   }
    // })
  },
  //绑定文章标题输入框失去焦点事件
  bindBlur: function(e) {
    if (e.detail.value == null || e.detail.value == "") {
      wx.showToast({
        title: '文章标题不能为空',
        icon: 'none'
      })  
    }
    this.setData({
      title: e.detail.value
    })
  },
  //绑定下拉框选择事件
  bindPickerChange(e) {
    this.setData({
      articleType: this.data.index[e.detail.value],
      indexs: e.detail.value
    })
  },
  //选择图片
  chooseImage: function (e) {
    var that = this;
    if(that.data.files.length >= 1) {
      wx.showToast({
        title: '标题图片最多上传1张',
        icon: 'none'
      })
      return;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '上传中',
        })
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        //上传图片
        wx.uploadFile({
          url: app.globalData.url + '/oss/v1/uploadFile',
          filePath: that.data.files[0],
          name: 'file',
          success: res => {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            });
            that.setData({
              image: JSON.parse(res.data).msg
            });
          },
          fail: res => {
            wx.hideLoading();
            wx.showToast({
              title: '网络异常，请稍后再试',
              icon: 'none'
            })
          }
        })
      }
    })
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //删除图片
  deleteImg: function(e) {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认要删除该图片吗？',
      showCancel: true,
      success: res => {
        if(res.confirm) {
          //TODO 删除阿里云OSS上的文件
          that.setData({
            files: [],
            image: ""
          })
        } else {
          return;
        }
      }
    })
  },

  /**
   * 获取下拉框值
   */
  loadSelecor: function() {
    const that = this;
    wx.request({
      url: app.globalData.url + '/dict/v1/getDictByKey/article_type_' ,
      method: "GET",
      success: res => {
        console.log("请求下拉列表返回数据==>", res);
        that.setData({
          types: res.data.data.value,
          index: res.data.data.key
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //加载下拉框
    this.loadSelecor();

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