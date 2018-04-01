//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

// console.log(app);
Page({
  data: {
    canIUse: false,
    startProv:'',
    startCity:'',
    pointProv:'',
    pointCity:'',
    nowCity: '定位中...',
    userInfo: {},
    imgUrls: [  {    
        link:'/pages/index/index',    
        url:'../../images/lunbo/1.jpg'     
    },{    
        link:'/pages/index/index',    
        url:'../../images/lunbo/2.jpg' 
    },{    
        link:'/pages/index/index',    
        url:'../../images/lunbo/3.jpg'   
    }],
    indicatorDots: true,    
    autoplay: true,    
    interval: 3000,    
    duration: 1000,
    indicatorColor:'#998a89',
    indicatorActiveColor:'#fff',
    list: [
      /* {
        id:0,
        image: "../../images/testimg/1.jpg",
        company: "大江物流",
        phone: '13966780466',
        address: '合肥购物广场物流园1234',
        start:'合肥',
        point:'杭州'
      }, */
    ]
  },
  onLoad: function (e) {
    /* 是否邀请进入 */
    var ooid = e.ooid
    // console.log('app.globalData::'+JSON.stringify(app.globalData));
    if (ooid) {
      // 获取邀请人 openid 并设置到 app.globalData
      app.globalData.ooid = ooid
    }
    // console.log('app.globalData::'+JSON.stringify(app.globalData));
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }

    // 是否查询线路操作
    var getLocParam = {
      isgetZhuanxian: true
    }
    this.getNowLocation(getLocParam); // 获取当前位置
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
  },
  searchzhuanxian (e) {
    // 本业内查询专线，按照精品专线发布时间/普通专线发布时间倒序排序
    // console.log(e)
    var start = e.currentTarget.dataset.start
    var point = e.currentTarget.dataset.point
    var params = {
      start: start,
      point: point
    }
    this.getTuis(params);
  },
  getTuis: function(e) {
    var that = this;
    console.log('getTuis')
    var start = ''
    var point = ''
    if (undefined!=e) {
      if (e.start == undefined) {
        util.showMaskTip1500('请选择出发地')
        return
      } else {
        start = e.start
      }
      // console.log(e.point)
      if (undefined == e.point) {
        util.showMaskTip1500('请选择目的地')
        return
      } else {
        point = e.point
      }
    } else {
      // 默认不带条件查询
      start = that.data.startCity
      point = '';
    }

    // console.log(that)
    // console.log(start)
    
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.zhuanxianUrl+'/tui',
      data: {
        'start': start,
        'point': point
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        sign: 'sign123123',
        ver: 'v1'
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        if(res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，专线数据请求错误',
            icon: 'none',
            // icon: 'loading',
            duration: 2000
          })
          return
        }
        // console.log('success123')
        that.setData({list:res.data.data.list})
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v01',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        console.log('fail');
        // coonsole.log(res);
      },
      complete: function(res) {
        // console.log('complete');
        // console.log(res)
      }
    })
    // console.log();
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
        // console.log("拨打电话失败！")  
      }  
    })  
  },
  getNowLocation: function(e) {
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
              // that.setData({'nowCity':res.data.result.addressComponent.city})
              var cityStr = res.data.result.addressComponent.city
              if (cityStr.indexOf('市')!=-1){
                cityStr = cityStr.replace('市','')
              }
            
              that.setData({
                nowCity:cityStr,
                startCity:cityStr
              })

              // 获取当前位置后再查找专线
              if(undefined != e) {
                if (undefined != e.isgetZhuanxian) {
                  that.getTuis(); // 获取推荐专线
                }
              }
            }
          }
        })
      }
    })
  },
  changeCity (e) {
    console.log('changeCity')
    // 选中的城市值赋值
    console.log(e)
    var setCityDirection = e.direction
    if (setCityDirection == 'startCity') {
      this.setData({
        startCity: e.city,
        startProv: e.prov
      })
    } else {
      this.setData({
        pointCity: e.city,
        pointProv: e.prov
      })
    }
  }
})
