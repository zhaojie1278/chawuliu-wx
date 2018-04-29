//app.js

var config = require('./config')
var util = require('./utils/util.js')

// console.log(config);

var topcat = '发布信息'
var zxCatsIden = 1;
var zxCatsTxt = '物流专线';
var sellCatsIden = 2;
var sellCatsTxt = '车辆买卖';
var zhaopinCatsIden = 3;
var zhaopinCatsTxt = '56同城';

var allCats = [
  {id:zxCatsIden,txt:zxCatsTxt},
  {id:sellCatsIden,txt:sellCatsTxt},
  {id:zhaopinCatsIden,txt:zhaopinCatsTxt},
]

var allCatsKeyVal = new Array(4)
allCatsKeyVal[0] = '分类'
allCatsKeyVal[1] = '物流专线'
allCatsKeyVal[2] = '车辆买卖'
allCatsKeyVal[3] = '56同城'

/* 专线类型 */
var zxCats = [
  {id:0,txt:'物流专线'},
  {id:1,txt:'省际专线'},
  {id:2,txt:'省内专线'},
  {id:3,txt:'空运'},
  {id:4,txt:'海运'},
  {id:5,txt:'配载调车'},
  {id:6,txt:'市内倒短车'},
]

var zxCatShengji = 1
var zxCatShengnei = 2
var zxCatKongyun = 3
var zxCatHaiyun = 4
var zxCatPeizai = 5
var zxCatShinei = 6

var zxCatsKeyVal = new Array(6)
zxCatsKeyVal[0] = '物流专线'
zxCatsKeyVal[1] = '省际专线'
zxCatsKeyVal[2] = '省内专线'
zxCatsKeyVal[3] = '空运'
zxCatsKeyVal[4] = '海运'
zxCatsKeyVal[5] = '配载调车'
zxCatsKeyVal[6] = '市内倒短车'

// 车辆买卖
/* 
  var sellCats = [
    // {id:1,txt:'牵引车'},
    // {id:2,txt:'载货车'},
    // {id:3,txt:'自卸车'},
    // {id:4,txt:'工程车'},
    {id:1,txt:'单桥货车'},
    // {id:6,txt:'水泥罐车'},
    // {id:7,txt:'油罐车'},
    {id:2,txt:'挂车'},
  ] 

  var sellCatsKeyVal = new Array(8)
  // sellCatsKeyVal[0] = '牵引车'
  // sellCatsKeyVal[1] = '载货车'
  // sellCatsKeyVal[2] = '自卸车'
  // sellCatsKeyVal[3] = '工程车'
  sellCatsKeyVal[0] = '单桥货车'
  // sellCatsKeyVal[5] = '水泥罐车'
  // sellCatsKeyVal[6] = '油罐车'
  sellCatsKeyVal[1] = '挂车'
  // sellCatsKeyVal[8] = '车主招聘司机'
  // sellCatsKeyVal[9] = '公司招聘司机'
  sellCatsKeyVal[2] = ''
  sellCatsKeyVal[3] = ''
*/

var sellCats = [
  {id:0,txt:'车辆买卖'},
  /*{id:1,txt:'单桥货车'},
  {id:2,txt:'挂车'},*/
  {id:1,txt:'出售'},
  {id:2,txt:'购买'},
]

var sellCatsKeyVal = new Array(3)
sellCatsKeyVal[0] = '车辆买卖'
// sellCatsKeyVal[1] = '单桥货车'
// sellCatsKeyVal[2] = '挂车'
sellCatsKeyVal[1] = '出售'
sellCatsKeyVal[2] = '购买'

// 车辆买卖发布类型
var selltypesKeyVal = new Array(3)
selltypesKeyVal[0] = ''
selltypesKeyVal[1] = '出售'
selltypesKeyVal[2] = '购买'


// 车辆买卖发布类型
var selltypes = [
  {name: '0', value: '请选择'},
  {name: '1', value: '出售', checked: 'true'},
  {name: '2', value: '购买'},
]

// 招聘
var zhaopinCats = [
  {id:0,txt:'56同城'},
  {id:1,txt:'招聘'},
  {id:2,txt:'求职'},
]

var zhaopinCatsKeyVal = new Array(3);
zhaopinCatsKeyVal[0] = '56同城'
zhaopinCatsKeyVal[1] = '招聘'
zhaopinCatsKeyVal[2] = '求职'

// 分类聚合
var allCats2SubCats = [
  {
    id:zxCatsIden,
    txt:zxCatsTxt,
    subCats: zxCats
  },
  {
    id:sellCatsIden,
    txt:sellCatsTxt,
    subCats: sellCats
  },
  {
    id:zhaopinCatsIden,
    txt:zhaopinCatsTxt,
    subCats: zhaopinCats
  }
]

// 当前时间


App({
  onLaunch: function () {

    // 用于小程序退出后台再打开实时显示定位
    var showIden1 = 1;
    var showIden2 = 1;
    var showIden3 = 1;
    var showIden4 = 1;
    var showIden5 = 1;
    var showIden6 = 1;
    var showIden7 = 1;
    this.globalData.showIden1 = showIden1;
    this.globalData.showIden2 = showIden2;
    this.globalData.showIden3 = showIden3;
    this.globalData.showIden4 = showIden4;
    this.globalData.showIden5 = showIden5;
    this.globalData.showIden6 = showIden6;
    this.globalData.showIden7 = showIden7;

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

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
    showIden1:0,
    showIden2:0,
    showIden3:0,
    showIden4:0,
    showIden5:0,
    showIden6:0,
    showIden7:0,
    userInfo: null,
    config:config,
    ooid:0, // 邀请人 openid
    topcat: topcat,
    allCats: allCats,
    allCatsKeyVal: allCatsKeyVal,
    allCats2SubCats: allCats2SubCats,
    zxCatsIden: zxCatsIden,
    sellCatsIden: sellCatsIden,
    zhaopinCatsIden: zhaopinCatsIden,
    zxCats: zxCats,
    zxCatsKeyVal: zxCatsKeyVal,
    sellCats: sellCats,
    sellCatsKeyVal: sellCatsKeyVal,
    zhaopinCats: zhaopinCats,
    zhaopinCatsKeyVal: zhaopinCatsKeyVal,
    selltypes: selltypes,
    selltypesKeyVal: selltypesKeyVal,
    zxCatsIden:zxCatsIden,
    sellCatsIden:sellCatsIden,
    zhaopinCatsIden:zhaopinCatsIden,
    zxCatShengji:zxCatShengji,
    zxCatShengnei:zxCatShengnei,
    zxCatKongyun:zxCatKongyun,
    zxCatHaiyun:zxCatHaiyun,
    zxCatPeizai:zxCatPeizai,
    zxCatShinei:zxCatShinei,
  },
  shareFun (res) { // 转发函数
    // console.log(res);
    var openid = wx.getStorageSync('openid')
    // console.log('oid:'+openid)
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
  },
  onShow (e) {
    console.log('app onshow');


    // 用于小程序退出后台再打开实时显示定位
    var showIden1 = this.globalData.showIden1+1;
    var showIden2 = this.globalData.showIden2+1;
    var showIden3 = this.globalData.showIden3+1;
    var showIden4 = this.globalData.showIden4+1;
    var showIden5 = this.globalData.showIden5+1;
    var showIden6 = this.globalData.showIden6+1;
    var showIden7 = this.globalData.showIden7+1;

    // console.log(e);
    /*wx.showModal({
      title: 'app . tip',
      content: 'content:'+JSON.stringify(e)+e.scene
    })*/
    // this.globalData.scene = e.scene
    // console.log(nowtime);
    // console.log(typeof(nowtime));
    // var nowtime = util.formatTime(new Date());
    wx.setStorage({
      key: 'showIden1',
      data: showIden1
    });
    wx.setStorage({
      key: 'showIden2',
      data: showIden2
    });
    wx.setStorage({
      key: 'showIden3',
      data: showIden3
    });
    wx.setStorage({
      key: 'showIden4',
      data: showIden4
    });
    wx.setStorage({
      key: 'showIden5',
      data: showIden5
    });
    wx.setStorage({
      key: 'showIden6',
      data: showIden6
    });
    wx.setStorage({
      key: 'showIden7',
      data: showIden7
    });
    console.log('app onshow end');
  }/*,
  onHide (e) {
    // 用于小程序退出后台再打开实时显示定位
    var showIden1 = 0;
    var showIden2 = 0;
    var showIden3 = 0;
    var showIden4 = 0;
    var showIden5 = 0;
    var showIden6 = 0;
    var showIden7 = 0;

    wx.setStorage({
      key: 'showIden1',
      data: showIden1
    });
    wx.setStorage({
      key: 'showIden2',
      data: showIden2
    });
    wx.setStorage({
      key: 'showIden3',
      data: showIden3
    });
    wx.setStorage({
      key: 'showIden4',
      data: showIden4
    });
    wx.setStorage({
      key: 'showIden5',
      data: showIden5
    });
    wx.setStorage({
      key: 'showIden6',
      data: showIden6
    });
    wx.setStorage({
      key: 'showIden7',
      data: showIden7
    });
  }*/
})