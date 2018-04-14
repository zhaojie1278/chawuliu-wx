//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var sellCats = app.globalData.sellCats
var sellCatsKeyVal = app.globalData.sellCatsKeyVal

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    sellCatId: 1,
    sellCats: [],
    catmenu: sellCatsKeyVal[0]
  },
  onLoad: function (e) {
    var catid = e.catid
    console.log('sellmsg111--'+catid)
    var sellCatId = sellCats[1].id
    // console.log('secondcat-first-id::'+sellCatId)
    this.setData({
      sellCatId: sellCatId,
      sellCats: sellCats
    })
    // var pages = getCurrentPages();
    // console.log(this.data)
  },
  bindCatsChange (e) {
    var sellCatId = e.currentTarget.dataset.catid
    this.setData({
      "sellCatId": sellCatId
    })
    // 超级买卖发布入口
    wx.navigateTo({
      url: '../sellmsg/add?catid='+sellCatId
    })    
  }
})
