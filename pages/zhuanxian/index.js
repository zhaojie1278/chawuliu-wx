//index.js
//获取应用实例
const app = getApp()

var navTxts = [
  {id:0,txt:'省内物流'},
  {id:1,txt:'省际物流'},
  {id:2,txt:'空运'},
  {id:3,txt:'海运'},
  {id:4,txt:'配载调车'}
]
Page({
  data: {
    startCity:'合肥',
    pointCity:'杭州',
    userInfo: {},
    isTaped: false,
    list: [
      {
        id:0,
        image: "../../images/testimg/1.jpg",
        title: "大江物流",
        pic:   "￥2000-4000/天",
        message:"合肥-上海",
        date:  "01-04",
        time:  "6天/周",
        city:  "广州 白云区",
        trade: "互联网/IT",
        phone: '13966780466'
      },
      {
        id:1,
        image: "../../images/testimg/2.jpg",
        title: "飞速物流",
        pic:   "￥100-200/天",
        message:"合肥-杭州",
        date:  "03-04",
        time:  "5天/周",
        city:  "广州 天河区",
        trade: "其他",
        phone: '13966780466'
      },
      {
        id:1,
        image: "../../images/testimg/3.jpg",
        title: "新元物流",
        pic:   "￥1000-3000/天",
        message:"合肥-深圳",
        date:  "05-04",
        time:  "5天/周",
        city:  "广州 白云区",
        trade: "服务/中介",
        phone: '13966780466'
      },
      {
        id:1,
        image: "../../images/testimg/4.jpg",
        title: "新时达物流",
        pic:   "￥4000-5000/天",
        message:"合肥-广州",
        date:  "05-04",
        time:  "5天/周",
        city:  "成都 高新区",
        trade: "金融",
        phone: '13966780466'
      }
    ],
    navTxts:navTxts,
    navid:0
  },
  bindNavTaped:function(e) {
    var id = parseInt(e.currentTarget.dataset.navid)  
    this.setData({  
      navid: id  
    })  
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.getNowLocation();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  calling:function(event){
    var that = this;
    // console.log(that.data);
    var phoneNumber = event.currentTarget.dataset.phoneNumber;
    // console.log(phoneNumber);
    wx.makePhoneCall({  
      phoneNumber: phoneNumber, //此号码并非真实电话号码，仅用于测试  
      success:function(){  
        // console.log("拨打电话成功！")  
      },  
      fail:function(){  
        console.log("拨打电话失败！")  
      }  
    })  
  },
  getNowLocation: function(event) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // 调用百度API获取位置具体地址名
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak='+app.globalData.baiduAk+'&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll', 
          data: { },
          header: { 'Content-Type': 'application/json' },
          success: function(res) {
            // console.log(res)
            // console.log(typeof(res.data.status));
            // console.log(res.data.result.addressComponent.city);
            if(res.data.status!=0) {
              that.setData({'nowCity':'位置获取失败'})
            } else {
              var cityStr = res.data.result.addressComponent.city
              if (cityStr.indexOf('市')!=-1){
                cityStr = cityStr.replace('市','')
              }
              that.setData({
                nowCity:cityStr,
                startCity:cityStr
              })
            }
          }
        })
      }
    })
  }
})