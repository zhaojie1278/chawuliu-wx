//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var zxCats = app.globalData.zxCatsSecond
var zxCatsKeyVal = app.globalData.zxCatsKeyVal

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    zxCatId: 1,
    zxCats: [],
    catmenu: ''
  },
  onLoad: function (e) {
    var catid = e.catid
    console.log('zx111---'+catid)
    var zxCatId = app.globalData.zxCatsSecond[0].id
    // console.log('secondcat-first-id::'+zxCatId)
    this.setData({
      zxCatId: zxCatId,
      zxCats: zxCats,
      catmenu: zxCatsKeyVal[catid-1],
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
