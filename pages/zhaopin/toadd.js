//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var zhaopinCats = app.globalData.zhaopinCats
var zhaopinCatsKeyVal = app.globalData.zhaopinCatsKeyVal

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    zhaopinCatId: 1,
    zhaopinCats: [],
    catmenu: zhaopinCatsKeyVal[0]
  },
  onLoad: function (e) {
    var catid = e.catid
    console.log('zhaopin111--'+catid)
    var zhaopinCatId = zhaopinCats[1].id
    // console.log('secondcat-first-id::'+zhaopinCatId)
    this.setData({
      zhaopinCatId: zhaopinCatId,
      zhaopinCats: zhaopinCats
    })
    // var pages = getCurrentPages();
    // console.log(this.data)
  },
  bindCatsChange (e) {
    var zhaopinCatId = e.currentTarget.dataset.catid
    this.setData({
      "zhaopinCatId": zhaopinCatId
    })
    // 超级买卖发布入口
    wx.navigateTo({
      url: '../zhaopin/add?catid='+zhaopinCatId
    })    
  }
})
