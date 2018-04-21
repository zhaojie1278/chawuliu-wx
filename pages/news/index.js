//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util")

Page({
  data: {
    canIUse: false,
    startProv:'',
    startCity:'',
    startVal: '',
    pointProv:'',
    pointCity:'',
    pointVal: '',
    nowCity: '定位中...',
    nowProv: '省份',
    nowDistrict: '区县',
    nowAreaVal: '',
    nowAreaCatStr: '',
    userInfo: {},
    isTaped: false,
    list: [
      {
        id: 1,
        titleimg: '../../images/testimg/1.jpg',
        title: '新闻123新闻123',
        update_time: '2018-4-18',
        content: '新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容'
      },
      {
        id: 1,
        titleimg: '',
        title: '新闻123新闻123新闻123新闻',
        update_time: '2018-4-18',
        content: '新闻内容新闻内容新闻内容新闻内容新闻内容容'
      },
      {
        id: 1,
        titleimg: '../../images/testimg/1.jpg',
        title: '新闻123新闻123新闻123新闻123新闻123新闻123新闻123',
        update_time: '2018-4-18',
        content: '新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容'
      }
    ],
    zxCats:app.globalData.zxCats,
    cat:1
  },
  onLoad: function (e) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // this.getSearches();
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getSearches: function(e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.newsUrl+'/search',
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        console.log('res.data.status:'+res.data.status);
        if(res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，数据请求错误',
            icon: 'none',
            // icon: 'loading',
            duration: 2000
          })
          return
        }
        that.setData({list:res.data.data.list})
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据请求错误.v01',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        console.log('fail');
        // coonsole.log(res);
      },
      complete: function(res) {
        console.log('complete');
        // console.log(res)
      }
    })
    // console.log();
  }
})