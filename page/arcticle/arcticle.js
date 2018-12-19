const app = getApp();
const { $Message } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    indicatorColor: 'black',
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 1000,
    title: '',
    list: [],
    page: 1,
    pageSize: 2,
    pages: 0, //总页数
    total: 0 //总记录数
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
        var imgUrls = [];
        if(res.data.code == 200) {
          for(var i=0; i < res.data.data.length; i++) {
            imgUrls.push(res.data.data[i].url);
          }
          that.setData({
            imgUrls: imgUrls
          })
        }
        if (res.data.code == 500) {
          $Message({
            content: '网络异常，请稍后重试',
            type: 'error'
          });
          console.log(res);
        }
      },
    })

    //获取文章列表数据
    this.getArticlerList(this.data.page, this.data.pageSize);
  },

  getArticlerList (page, pageSize) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/article/v1/getArticlerList/' + page + '/' + pageSize,
      method: 'GET',
      success: res => {
        if (res.data.code == 200) {
          var article_list = that.data.list;
          // debugger;
          if (that.data.total == 0) {
            //第一次加载页面
            that.setData({
              list: res.data.data.records,
              total: res.data.data.total,
              pages: res.data.data.pages
            })
            //判断 当前页小于 总页数， 且总页数没有增加的情况 直接push
          } else if (page < res.data.data.pages && that.data.pages == res.data.data.pages) {
            for (let i = 0; i < res.data.data.records.length; i++){
              article_list.push(res.data.data.records[i]);
            }
            that.setData({
              list: article_list
            })
            //判断 当前页等于总页数（也就是最后一页） 且总页数没有增加的情况
          } else if (page == res.data.data.pages && that.data.pages == res.data.data.pages) {
            // 总条数 没有增加， 也没有加载最后一页时，直接push
            if (that.data.total == res.data.data.total && that.data.list.length < res.data.data.total) {
              for (let i = 0; i < res.data.data.records.length; i++) {
                article_list.push(res.data.data.records[i]);
              }
              that.setData({
                list: article_list
              })
              // 总条数 增加了 但没有超过当前页size
            } else if (that.data.total < res.data.data.total) {
              //已经全部加载完成的情况下 要添加新增的N条记录
              if (that.data.list.length == that.data.total) {
                const num = pageSize * (page - 1);
                for (let i = num + 1; i < that.data.list.length && i > num; i++) {
                  article_list.remove(i);
                }
                for (let i = 0; i < res.data.data.records.length; i++) {
                  article_list.push(res.data.data.records[i]);
                }
                that.setData({
                  list: article_list
                })
              } else {
                // 总条数增加，但未加载最后一页 直接push
                for (let i = 0; i < res.data.data.records.length; i++) {
                  article_list.push(res.data.data.records[i]);
                }
                that.setData({
                  list: article_list
                })
              }
            } else {
              //全部加载完毕
              wx.showToast({
                title: '暂无更多数据',
                icon: 'none'
              })
            }
          }
        }
        if (res.data.code == 500) {
          $Message({
            content: '网络异常，请稍后重试',
            type: 'error'
          });
        }
        //请求完成关闭 loading
        wx.hideLoading();
      },
      fail: res => {
        $Message({
          content: '网络异常，请稍后重试',
          type: 'error'
        });
        //请求完成关闭 loading
        wx.hideLoading();
      }
    })
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
    // this.onLoad();
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
    // this.onLoad();
    // 停止下拉动作
    // wx.stopPullDownRefresh();
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    if (this.data.page == this.data.pages) {
      this.getArticlerList(this.data.page, this.data.pageSize);
    } else {
      this.getArticlerList(this.data.page + 1, this.data.pageSize);
      this.setData({
        page: that.data.page + 1
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.showLoading({
    //   title: '加载中',
    // });
    // if(this.data.page = this.data.pages) {
    //   this.getArticlerList(this.data.page, this.data.pageSize);
    // } else {
    //   this.getArticlerList(this.data.page + 1, this.data.pageSize);
    // }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})