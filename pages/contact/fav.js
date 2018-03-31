//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    item: {
      id: 0
    },
    list: [
      /* {
        cid: 3,
        nickname: "测试3",
        phone: "13966661234",
        company: "大江派公司",
        address: "合肥市蜀山区2",
        ishidden: false
      } */
    ],
    emptyshow: false
  },
  onLoad: function () {
    var pages = getCurrentPages();
    console.log(pages)
    console.log('pages.length::'+pages.length);
    var that = this
    // 获取已保存信息
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    // 获取公司信息
    var openid = wx.getStorageSync('openid');
    console.log('openid::'+openid)
    if (!openid) {
      util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
      return;
    }
    wx.request({
      url: app.globalData.config.service.favUrl+'/getfavors',
      data: {
        openid: openid
      },
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        if(res.data.status == 1) {
          that.setData({
            list: res.data.data.list,
          })
        } else {
          util.showMaskTip1500('抱歉，数据异常，请稍后重试')
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v05',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        console.log('fail');
      }
    })
    
    // wx.request({ 
    // wx.hideLoading();
  },
  changeFavitemHidden (e) {
    // 动态展示/隐藏收藏列表项
    console.log('changeFavitemHidden')
    // 选中的城市值赋值
    // console.log(e)
    var favItemIndex = e.favItemIndex
    var changedList = this.data.list
    var changedListLen = changedList.length
    var emptyshow = false
    if (e.isDoUnfav) {
      var ishiddenCount = 0;
      for(var i=0;i<changedListLen;i++) {
        if (changedList[i].ishidden) {
          ishiddenCount+=1
        }
      }
      // console.log('ishidden::'+ishiddenCount)
      changedList[favItemIndex].ishidden = true
      if (changedListLen == 1 || (changedListLen-ishiddenCount) == 1) {
        // changedList = []
        emptyshow = true
      }
    } else {
      changedList[favItemIndex].ishidden = false
    }
    this.setData({
      list: changedList,
      emptyshow: emptyshow
    })
    // console.log(this.data)
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  }
})
