//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var zhaopinCatsKeyVal = app.globalData.zhaopinCatsKeyVal

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    zhaopinCatId: 1,
    zhaopinCats: [],
    catmenu: ''
  },
  onLoad: function (e) {
    var catid = e.catid
    console.log('sellmsg111--'+catid)
    var zhaopinCats = app.globalData.allSellCatsSecond[catid]
    var zhaopinCatId = zhaopinCats[0].id
    // console.log('secondcat-first-id::'+zhaopinCatId)
    this.setData({
      zhaopinCatId: zhaopinCatId,
      zhaopinCats: zhaopinCats,
      catmenu: zhaopinCatsKeyVal[catid-1],
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
