// page/mine/mine.js
const app = getApp();
const { $Message } = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: '<p class="xing-p">这里是文字信息，点击上方或下去左边的方框可添加文本域；点击右边方框可添加图片：</p><img class="xing-img" style="width: 100%" src="https://www.uooyoo.com/img2017/2/15/2017021560909533.jpg" _height="0.61983" _uploaded="true"></img>',
    url: app.globalData.url + '/oss/v1/uploadFile',
    filename: 'file',
    keyChain: 'data.ossUrl',
    title: '', //文章标题
    articleType: 0, // 文章类型
    image: '', // 标题图片
    imageId: '',
    types: [], // 文章类型
    index: [], // 文章类型key
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

  finish: function (e) {
    console.log(e);
    const that = this;
    //组装数据
    that.setData({
      'article.createUser': app.globalData.user.userId,
      'article.title': that.data.title,
      'article.articleType': that.data.articleType,
      'article.content': e.detail.content,
      'article.image': that.data.imageId
    })
    wx.request({
      url: app.globalData.url + '/article/v1/saveArticle',
      method: 'POST',
      data: that.data.article,
      success: res => {
        if (res.data.code == 200) {
          $Message({
            content: '上传成功',
            type: 'success'
          });
          wx.navigateBack({
            delta: 1
          })
        }
        if (res.data.code == 500) {
          $Message({
            content: res.data.msg,
            type: 'error'
          });
        }
      },
      fail: res => {
        $Message({
          content: "网络异常，请稍后再试",
          type: 'error'
        });
      }
    })
  },
  //绑定文章标题输入框失去焦点事件
  bindBlur: function (e) {
    if (e.detail.value == null || e.detail.value == "") {
      $Message({
        content: '文章标题不能为空',
        type: 'warning'
      });
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
    if (that.data.files.length >= 1) {
      $Message({
        content: '标题图片最多上传1张',
        type: 'warning'
      });
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
            $Message({
              content: '上传成功',
              type: 'success'
            });
            console.log("上传图片 ", res);
            that.setData({
              image: JSON.parse(res.data).data.ossUrl,
              imageId: JSON.parse(res.data).data.ossId
            });
          },
          fail: res => {
            wx.hideLoading();
            $Message({
              content: '网络异常，请稍后再试',
              type: 'error'
            });
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
  deleteImg: function (e) {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认要删除该图片吗？',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          //删除阿里云OSS上的文件
          wx.request({
            url: app.globalData.url + '/oss/v1/deleteImage/' + that.data.imageId,
            method: 'DELETE',
            success: res => {
              $Message({
                content: '删除成功',
                type: 'success'
              });
            },
            fail: res => {
              console.log("删除标题图片失败", res);
              $Message({
                content: '网络异常，请稍后再试',
                type: 'error'
              });
              return;
            }
          })

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
   * 删除阿里云OSS上的文件
   */
  // deleteOssImgSync: function() {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.url + '/oss/v1/deleteImage/' + that.data.imageId,
  //     method: 'DELETE',
  //     success: res => {
  //       console.log("删除成功", res);
  //       wx.showToast({
  //         title: '删除成功',
  //         icon: 'success'
  //       })
  //       return '1';
  //     },
  //     fail: res => {
  //       console.log("删除标题图片失败", res);
  //       return 0;
  //     }
  //   })
  // },

  /**
   * 获取下拉框值
   */
  loadSelector () {
    const that = this;
    return new Promise(resolve => {
      wx.request({
        url: app.globalData.url + '/dict/v1/getDictByKey/article_type_',
        method: "GET",
        success: res => {
          that.setData({
            types: res.data.data.value,
            index: res.data.data.key
          });
          resolve();
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    var that = this;
    //加载下拉框
    await that.loadSelector()

    if (options.articleId) {
      //根据文章ID 获取文章详细信息
      wx.request({
        url: app.globalData.url + '/article/v1/getArticlerById/' + options.articleId,
        method: 'GET',
        success: res => {
          console.log(res);
          that.setData({
            title: res.data.data.title,
            indexs: that.data.index.indexOf(res.data.data.articleType.toString())
          })
          wx.hideLoading();
        },
        fail: res => {
          wx.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          })
        }
      })
    }
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