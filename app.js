//app.js

var config = require('./config')
var util = require('./utils/util.js')

// console.log(config);

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 校验用户当前session_key是否有效。
    wx.checkSession({
      success: function(sucres) {
        // session_key未过期
        console.log('checksession success')
        // console.log(sucres);
        var openid = wx.getStorageSync('openid')
        console.log('openid::'+openid);
        if (!openid) {
          wx.login({
            success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if(res.code){
              wx.request({
                url: config.service.openIdUrl, //仅为示例，并非真实的接口地址
                method:'POST',
                header: {
                  // 'content-type': 'application/json' 
                  "content-type": "application/x-www-form-urlencoded" // post 需增加
                },
                data: {
                  code: res.code
                },
                success: function(res) {
                  console.log('oopenid url acc suc:');
                  console.log(res)
                  // console.log(res);
                  var data = res.data;
                  if(data.status === 0){
                    util.showModel('用户信息获取失败', '请稍后重试')
                  } else {
                    wx.setStorage({key:"openid",data:data.data.openid});
                  }
                },
                fail: function(res) {
                  console.log('oopenid url acc fail:');
                  console.log(res)
                }
              })
            }
            }
          })
        }
      },
      fail: function (failres) {
        // console.log(failres);
        // session_key过期
        // 登录
        // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
        wx.login({
          success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if(res.code){
            wx.request({
              url: config.service.openIdUrl, //仅为示例，并非真实的接口地址
              method:'POST',
              header: {
                // 'content-type': 'application/json' 
                "content-type": "application/x-www-form-urlencoded" // post 需增加
              },
              data: {
                code: res.code
              },
              success: function(res) {
                console.log('oopenid url acc suc:');
                console.log(res)
                // console.log(res);
                var data = res.data;
                if(data.status === 0){
                  util.showModel('用户信息获取失败', '请稍后重试')
                } else {
                  wx.setStorage({key:"openid",data:data.data.openid});
                }
              },
              fail: function(res) {
                console.log('oopenid url acc fail:');
                console.log(res)
              }
            })
          }
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baiduAk:'pdDY8jZw89lTn8OHEA6rS8aWaDNmSEc4',
    config:config,
    ooid:0, // 邀请人 openid
  },
  shareFun (res) { // 转发函数
    console.log(res);
    var openid = wx.getStorageSync('openid')
    console.log('oid:'+openid)
    return {
      title: '邀请您一起免费加入专业的物流专线实名认证社群',
      path: '/page/index/index?ooid='+openid,
      success: function(sharedRes) {
        // 转发成功
        console.log(sharedRes)
      },
      fail: function(sharedFailRes) {
        /* 
        sharedFailRes = sharedFailRes.errMsg.split(':');
        util.showError('转发失败：'+sharedFailRes[1])
         */
      }
    }
  }
})