//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var zxCats = app.globalData.zxCats
var zxCatsKeyVal = app.globalData.zxCatsKeyVal

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    zxCatId: 0,
    zxCats: [],
    catmenu: zxCatsKeyVal[0]
  },
  onLoad: function (e) {
    var catid = e.catid
    console.log('zx111---'+catid)
    var zxCatId = app.globalData.zxCats[1].id
    // console.log('secondcat-first-id::'+zxCatId)
    this.setData({
      // zxCatId: zxCatId, // 默认第一个
      zxCats: zxCats
    })
    // var pages = getCurrentPages();
    // console.log(this.data)
  },
  bindCatsChange (e) {
    var zxCatId = e.currentTarget.dataset.catid
    this.setData({
      "zxCatId": zxCatId
    })
    // 超级买卖发布入口
    wx.navigateTo({
      url: '../zhuanxian/add?catid='+zxCatId
    })    
  }
})
