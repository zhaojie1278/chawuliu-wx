//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util")

Page({
  data: {
    userInfo: {},
    isTaped: false,
    list: [
      /*
      {
        id: '8',
        prov: '北京市',
        city: '北京市',
        cid: '6',
        selltype: '0',
        content: '找个大货车的工作找个大货车找个大货车的工作找个大货车找个大货车的工作找个大货车找个大货车的工作找个大货车找个大货车的工作找个大货车找个大货车的工作找个大货车找个大货车的工作找个大货车',
        domainimg1: 'http://local.chawuliu2018.com/uploads/wafer/sellmsg/20180406/78afdc0531c2943b9f0558617c60b4be.jpg',
        domainimg2: 'http://local.chawuliu2018.com/uploads/wafer/sellmsg/20180406/dd0186f997703592f5da99e6dda795c6.jpg',
        domainimg3: '',
        domainimg4: '',
        marks: '',
        status: '1',
        nickname: 'Jwuliu',
        phone: '13966666666',
        address: '安徽合肥',
        isrecommend: '0',
        cat: 10,
        timebefore: '3小时前',
        avatarurl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIVR2wY9icec2AicOFt3pSaIDR6PBBnbd3HvrRq9GrjypyDFY71eRptOJd69xYcDgI6ZbQ8zLlNIsZQ/0',
        company: 'J物流',
        imgcount: 5
      }
      */
    ],
    zhaopinCats: app.globalData.zhaopinCats,
    prov: '',
    city: '',
    cat: 1, // second cat
    // firstcatid: 2,
    catsKeyVal: app.globalData.zhaopinCatsKeyVal,
    detailUrl:'detail',
    detailFrom: 'zhaopin'
  },
  onLoad: function (e) {
    console.log('in zhaopin')

    var cat = e.cat
    // console.log(cat);
    this.setData({
      cat: cat
    })

    // 是否查询线路操作
    var getLocParam = {
      isget: true
    }
    this.getNowLocation(getLocParam); // 获取推荐专线
  },
  bindNavFirstTaped:function(e) {
    // 分类切换
    var cat = parseInt(e.currentTarget.dataset.cat)  
    this.setData({
      cat: cat,
    })
    this.searchsellmsg(e)
  },/* 
  bindNavSecondTaped:function(e) {
    // 分类切换
    var id = parseInt(e.currentTarget.dataset.cat)
    console.log('second-id:'+id)
    console.log('data')
    console.log(this.data)
    this.setData({
      cat: id
    })
    this.searchsellmsg(e)
  }, */
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
  searchsellmsg (e) {
    // 本业内查询专线，按照精品专线发布时间/普通专线发布时间倒序排序
    // console.log(e)
    var prov = e.currentTarget.dataset.prov
    var city = e.currentTarget.dataset.city
    var cat = e.currentTarget.dataset.cat
    var params = {
      prov: prov,
      city: city,
      cat: cat
    }
    this.getSearches(params);
  },
  getSearches: function(e) {
    var that = this;
    console.log('getSearches -- zhaopin')
    console.log('search-param' + JSON.stringify(e));
    var prov = ''
    var city = ''
    var cat = 0
    // var firstcatid = 0
    // console.log(e)
    if (undefined!=e) {
      if(undefined != e.prov) {
        prov = e.prov
      }
      if(undefined != e.city) {
        city = e.city
      }
      if(undefined != e.cat) {
        cat = e.cat
      }
      /* if(undefined != e.firstcatid) {
        firstcatid = e.firstcatid
      } */
    } else {
      // 默认不带条件查询
      prov = that.data.prov
      city = that.data.city
      cat = that.data.cat
      // firstcatid = that.data.firstcatid
    }
    // console.log(e)
      // 默认不带条件查询
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.zhaopinUrl+'/search',
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        prov: prov,
        city: city,
        cat: cat
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
        console.log('getSearches --- in')
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
              var provStr =  res.data.result.addressComponent.province
              if (provStr.indexOf('市')!=-1){
                provStr = provStr.replace('市','')
              }
              if (provStr.indexOf('省')!=-1){
                provStr = provStr.replace('省','')
              }
              var cityStr = res.data.result.addressComponent.city
              if (cityStr.indexOf('市')!=-1){
                cityStr = cityStr.replace('市','')
              }
              var cat=that.data.cat
              that.setData({
                prov: provStr,
                city:cityStr,
                cat: cat
              })

              // 获取当前位置后再查找专线
              if(undefined != e) {
                if (undefined != e.isget) {
                  var params = {
                    prov: provStr,
                    city: cityStr,
                    cat: cat
                  }
                  that.getSearches(params); // 获取推荐专线
                }
              }
            }
          }
        })
      }
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
  }
})