//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url1:'./company',
    url2:'',
    url3:'./fav',
    url4:'',
    url5:'./zhuanxians',
    url6:'./sellmsgs',
    url7:'./zhaopins',
    url8:'./mingpian',
  },
  onLoad: function () {

  },
  onShow: function(e) {

    // 查看是否有 userInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log('----------else')

      wx.showModal({
        title: '提示',
        content: '当前微信版本不支持，请升级微信版本',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            /*wx.showToast({
              title: '升级微信后，欢迎您再次访问此小程序',
              icon: 'none',
              duration: 2000
            })*/

            wx.showLoading({
              title: '您可查看首页',
              mask: true
            })

            setTimeout(function(){
              wx.hideLoading()
              wx.switchTab({
                url: '../index/index'
              })
            },1000);
          }
        }
      })
      return;
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail(e) {
          console.log('fail')
          console.log(e);
          console.log('fail--ed')
        },
        complete(e) {
          console.log('com')
          console.log(e);
          console.log('com--ed')
        }
      })
    }
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  getUserInfo: function(e) {
    // console.log(e)
    if (e.detail.errMsg.indexOf('fail auth deny') !== -1) {
      // 拒绝授权
      wx.showModal({
        title: '提示',
        content: '抱歉，拒绝授权将无法正常显示个人信息，请点击按钮重新授权',
        showCancel: false
      })
    } else if (undefined != e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      // 获取用户数据
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '授权失败，请稍后重试，或尝试点击按钮重新授权',
      })
    }
  }
})
