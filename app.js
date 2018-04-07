//app.js

var config = require('./config')
var util = require('./utils/util.js')

// console.log(config);
/* 专线类型 */
var zxCats = [
  {id:1,txt:'车源'}
]
var zxCatsKeyVal = new Array(1)
zxCatsKeyVal[0] = '车源'

var zxCatsSecond = [
  {id:1,txt:'省际物流'},
  {id:2,txt:'省内物流'},
  {id:3,txt:'空运'},
  {id:4,txt:'海运'},
  {id:5,txt:'配载调车'},
  {id:6,txt:'市内倒短车'},
]

var zxCatsSecondKeyVal = new Array(6)
zxCatsSecondKeyVal[0] = '省际物流'
zxCatsSecondKeyVal[1] = '省内物流'
zxCatsSecondKeyVal[2] = '空运'
zxCatsSecondKeyVal[3] = '海运'
zxCatsSecondKeyVal[4] = '配载调车'
zxCatsSecondKeyVal[5] = '市内倒短车'

// 超级买卖
var sellCats = [
  {id:2,txt:'车辆买卖'},
  {id:3,txt:'司机招聘'},
]

var sellCatsKeyVal = new Array(2)
sellCatsKeyVal[1] = '车辆买卖'
sellCatsKeyVal[2] = '司机招聘'

// 车辆买卖
var sellCatsSecond = [
  {id:1,txt:'牵引车'},
  {id:2,txt:'载货车'},
  {id:3,txt:'自卸车'},
  {id:4,txt:'工程车'},
  {id:5,txt:'单桥货车'},
  {id:6,txt:'水泥罐车'},
  {id:7,txt:'油罐车'},
  {id:8,txt:'挂车'},
]

var sellCatsSecondKeyVal = new Array(8)
sellCatsSecondKeyVal[0] = '牵引车'
sellCatsSecondKeyVal[1] = '载货车'
sellCatsSecondKeyVal[2] = '自卸车'
sellCatsSecondKeyVal[3] = '工程车'
sellCatsSecondKeyVal[4] = '单桥货车'
sellCatsSecondKeyVal[5] = '水泥罐车'
sellCatsSecondKeyVal[6] = '油罐车'
sellCatsSecondKeyVal[7] = '挂车'
// sellCatsSecondKeyVal[8] = '车主招聘司机'
// sellCatsSecondKeyVal[9] = '公司招聘司机'
sellCatsSecondKeyVal[8] = '招聘司机'
sellCatsSecondKeyVal[9] = '司机求职'


// 车辆买卖发布类型
var selltypesKeyVal = new Array(2)
selltypesKeyVal[0] = ''
selltypesKeyVal[1] = '出售'
selltypesKeyVal[2] = '购买'

// 招聘信息
var zhaopinCatsSecond = [
  // {id:9,txt:'车主招聘司机'},
  // {id:10,txt:'公司招聘司机'},
  {id:9,txt:'招聘司机'},
  {id:10,txt:'司机求职'},
]
var zhaopinCatsSecondObj = {
  // 9: '车主招聘司机',
  // 10: '公司招聘司机',
  9: '招聘司机',
  10: '司机求职'
}

var allSellCatsSecond = {
  2: sellCatsSecond,
  3: zhaopinCatsSecond,
}



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
        // console.log('checksession success')
        // console.log(sucres);
        var openid = wx.getStorageSync('openid')
        // console.log('openid::'+openid);
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
    zxCats: zxCats,
    zxCatsKeyVal: zxCatsKeyVal,
    zxCatsSecond: zxCatsSecond,
    zxCatsSecondKeyVal: zxCatsSecondKeyVal,
    sellCats: sellCats,
    sellCatsKeyVal: sellCatsKeyVal,
    sellCatsSecond: sellCatsSecond,
    sellCatsSecondKeyVal: sellCatsSecondKeyVal,
    zhaopinCatsSecond: zhaopinCatsSecond,
    allSellCatsSecond: allSellCatsSecond,
    zhaopinCatsSecondObj: zhaopinCatsSecondObj,
    selltypesKeyVal: selltypesKeyVal
  },
  shareFun (res) { // 转发函数
    console.log(res);
    var openid = wx.getStorageSync('openid')
    console.log('oid:'+openid)
    return {
      title: '邀请您一起免费加入专业的物流资讯实名认证社群',
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