//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var zxCats = app.globalData.zxCatsSecond
var sellCats = app.globalData.sellCats
var allCats = zxCats.concat(sellCats)
var sellCatsKeyVal = app.globalData.sellCatsKeyVal
var zhaopinCatsKeyVal = app.globalData.zhaopinCatsKeyVal

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    areacatid: 1,
    allCats: allCats
  },
  onLoad: function () {
    var pages = getCurrentPages();
  },
  bindCatsChange (e) {

    var areacatid = e.currentTarget.dataset.areacatid
    this.setData({
      "areacatid": areacatid
    })

    var switchAreacatid = areacatid - 1
    if (switchAreacatid in sellCatsKeyVal) {
      // 超级买卖发布入口
      console.log('app.globalData.sellCats')
      wx.navigateTo({
        url: '../sellmsg/toadd?catid='+areacatid
      })
    } else if (switchAreacatid in zhaopinCatsKeyVal) {
      console.log('app.globalData.zhaopinCats')
      wx.navigateTo({
        url: '../zhaopin/toadd?catid='+areacatid
      })
    } else {
      console.log('app.globalData.zxcats--'+areacatid)
      // 专线发布入口
      wx.navigateTo({
        url: '../zhuanxian/add?catid='+areacatid
      })
    }
    
  }
})
