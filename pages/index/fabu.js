// chaxun.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

Page({
  data: {
    plain: false,
    loading: false,
    defaultsize: 'default',
    catid: 0,
    cat_selid: 0,
    allCats: []
  },
  onLoad: function () {
    var zxCats = app.globalData.zxCats
    var sellCats = app.globalData.sellCats
    var zhaopinCats = app.globalData.zhaopinCats
    var allCats2SubCats = app.globalData.allCats2SubCats
    // console.log('chaxun.js '+JSON.stringify(allCats));
    var sellCatsKeyVal = app.globalData.sellCatsKeyVal

    this.setData({
      allCats2SubCats: allCats2SubCats
    })

    // var pages = getCurrentPages();
    wx.setNavigationBarTitle({
      title: '发布信息'
    })
  },
  bindCatsChange (e) {

    var catid = e.currentTarget.dataset.catid
    var subcatid = e.currentTarget.dataset.subcatid
    this.setData({
      cat_selid: catid + '-' + subcatid
    })
    
    // var subcatid = subcatid - 1
    if (catid == app.globalData.zxCatsIden) {
      // 专线
      wx.navigateTo({
        url: '../zhuanxian/add?catid='+subcatid
      })
    } else if (catid == app.globalData.sellCatsIden) {
      // 车辆买卖
      wx.navigateTo({
        url: '../sellmsg/add?catid='+subcatid
      })
    } else if (catid == app.globalData.zhaopinCatsIden) {
      // 司机
      wx.navigateTo({
        url: '../zhaopin/add?catid='+subcatid
      })
    }
    
  }
})