//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')


Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    areacatid: 1,
    zxCats: app.globalData.zxCats
  },
  onLoad: function () {
    var pages = getCurrentPages();

    console.log(this.data.zxCats)
    console.log('pages.length:'+pages.length)
  },
  bindCatsChange (e) {
    this.setData({
      "areacatid": e.currentTarget.dataset.areacatid
    })
    wx.navigateTo({
      url: 'add?catid='+e.currentTarget.dataset.areacatid
    })
  }
})
