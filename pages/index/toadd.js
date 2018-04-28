// toadd.js  发布信息，大分类样式
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

var zxCats = app.globalData.zxCats
var allCats = app.globalData.allCats
var zxCatsIden = app.globalData.zxCatsIden
var sellCatsIden = app.globalData.sellCatsIden
var zhaopinCatsIden = app.globalData.zhaopinCatsIden
var topcat = app.globalData.topcat


Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    catid: 0,
    allCats: allCats,
    catmenu: topcat
  },
  onLoad: function () {
    // var pages = getCurrentPages();
  },
  bindCatsChange (e) {

    var catid = e.currentTarget.dataset.catid
    this.setData({
      "catid": catid
    })
    if (catid==zxCatsIden) {
      console.log('app.globalData.zxcats--'+catid)
      // 专线发布入口
      wx.navigateTo({
        url: '../zhuanxian/toadd?catid='+catid
      })
    } else if (catid == zhaopinCatsIden) {
      // 司机招聘发布入口
      console.log('app.globalData.zhaopinCats')
      wx.navigateTo({
        url: '../zhaopin/toadd?catid='+catid
      })
    } else {
      // 车辆买卖发布入口
      console.log('app.globalData.sellCats')
      wx.navigateTo({
        url: '../sellmsg/toadd?catid='+catid
      })
    }
    
  }
})
