//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util")

Page({
  data: {
    canIUse: false,
    startProv:'',
    startCity:'',
    startVal: '',
    pointProv:'',
    pointCity:'',
    pointVal: '',
    nowCity: '定位中...',
    nowProv: '省份',
    nowDistrict: '区县',
    nowAreaVal: '',
    nowAreaCatStr: '',
    userInfo: {},
    isTaped: false,
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
    ],
    zxCats:app.globalData.zxCats,
    cat:1
  },
  onLoad: function (e) {
    console.log('e.cat::'+e.cat);
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

    // 设置当前选中分类
    var cat = e.cat
    this.setData({
      cat: cat
    })

    // 是否查询线路操作
    var getLocParam = {
      isgetZhuanxian: true,
      cat: cat
    }
    this.getNowLocation(getLocParam); // 获取当前位置
    
    // this.bindNavTaped(navParam)
  },
  bindNavTaped:function(e) {
    if (undefined != e.cat) {
      var catid = e.cat
    } else {
      var catid = e.currentTarget.dataset.cat
    }
    // 专线区域类别切换
    var catid = parseInt(catid)  
    this.setData({  
      cat: catid
    })
    if (catid == app.globalData.zxCatShengji || catid == app.globalData.zxCatKongyun || catid == app.globalData.zxCatHaiyun || catid == app.globalData.zxCatPeizai) {
      this.setData({
        startVal: this.data.nowProv,
        nowAreaVal: this.data.nowProv,
        nowAreaCatStr: '',
        pointVal: '请选择'
      })
    } else if (catid == app.globalData.zxCatShengnei) {
      console.log('catidcatidcatid::'+catid);
      this.setData({
        startVal: this.data.nowCity,
        nowAreaVal: this.data.nowProv,
        nowAreaCatStr: 'province',
        pointVal: '请选择'
      })
    } else if (catid == app.globalData.zxCatShinei) {
      this.setData({
        startVal: this.data.nowDistrict,
        nowAreaVal: this.data.nowCity,
        nowAreaCatStr: 'city',
        pointVal: '请选择'
      })
    } else {
      this.setData({
        startVal: this.data.nowCity,
        nowAreaVal: this.data.nowCity,
        nowAreaCatStr: 'city',
        pointVal: '请选择'
      })
    }
    console.log(this.data)
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  searchzhuanxian (e) {
    // 本业内查询专线，按照精品专线发布时间/普通专线发布时间倒序排序
    // console.log(e)
    var start = e.currentTarget.dataset.start
    var point = e.currentTarget.dataset.point
    var cat = e.currentTarget.dataset.catid
    var params = {
      start: start,
      point: point,
      catid: cat
    }
    this.getSearches(params);
  },
  getSearches: function(e) {
    var that = this;
    console.log('getSearches')
    var start = ''
    var point = ''
    var catid = 0
    // console.log(e)
    if (undefined!=e) {
      if (e.start == undefined) {
        util.showMaskTip1500('请选择出发地')
        return
      } else {
        start = e.start
      }
      // console.log('e.point::'+e.point)
      if (undefined == e.point) {
        util.showMaskTip1500('请选择目的地')
        return
      } else {
        point = e.point
      }

      if(undefined != e.catid) {
        catid = e.catid
      }
    } else {
      // 默认不带条件查询
      start = that.data.startVal
      point = that.data.pointVal
      catid = that.data.cat
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.zhuanxianUrl+'/search',
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        start: start,
        point: point,
        cat: catid
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        console.log('res.data.status:'+res.data.status);
        if(res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，专线数据请求错误',
            icon: 'none',
            // icon: 'loading',
            duration: 2000
          })
          return
        }
        // console.log(res)
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
        console.log('complete');
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
        console.log("拨打电话失败！")  
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
          url: app.globalData.config.service.baiduApi+'&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll', 
          data: { },
          header: { 'Content-Type': 'application/json' },
          success: function(res) {
            // console.log(res)
            // console.log(typeof(res.data.status));
            // console.log(res.data.result.addressComponent.city);
            if(res.data.status!=0) {
              that.setData({'nowCity':'位置获取失败'})
            } else {
              var provStr = res.data.result.addressComponent.province
              // provStr = '安徽省'
              var cityStr = res.data.result.addressComponent.city
              // cityStr = '合肥市'
              var districtStr = res.data.result.addressComponent.district
              // districtStr = '蜀山区'
              that.setData({
                nowCity:cityStr,
                nowProv:provStr,
                nowDistrict:districtStr,
              })

              // 获取当前位置后再查找专线
              if(undefined != e) {
                if (undefined != e.isgetZhuanxian) {
                  var eParam = {
                    cat: e.cat
                  }
                  that.bindNavTaped(eParam)
                  that.getSearches(); // 获取推荐专线
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
        /*startCity: e.city,
        startProv: e.prov*/
        startVal: e.returnVal
      })
    } else {
      this.setData({
        /*pointCity: e.city,
        pointProv: e.prov*/
        pointVal: e.returnVal
      })
    }

    this.getSearches();
  }
})