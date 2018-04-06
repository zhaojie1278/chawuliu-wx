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
    firstcat: 1,
    sellCatsSecondKeyVal: app.globalData.sellCatsSecondKeyVal,
    selltypesKeyVal: app.globalData.selltypesKeyVal
  },
  bindNavTaped:function(e) {
    // 分类切换
    var id = parseInt(e.currentTarget.dataset.firstcat)  
    this.setData({  
      firstcat: id  
    })  
  },
  onLoad: function () {
    console.log('in sellmsg')
    this.getSearches(); // 获取推荐专线
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
  searchsellmsg (e) {
    // 本业内查询专线，按照精品专线发布时间/普通专线发布时间倒序排序
    // console.log(e)
    var start = e.currentTarget.dataset.start
    var point = e.currentTarget.dataset.point
    var areacat = e.currentTarget.dataset.areacat
    var params = {
      start: start,
      point: point,
      areacatid: areacat
    }
    this.getSearches(params);
  },
  getSearches: function(e) {
    var that = this;
    console.log('getSearches')
    // console.log(e)
      // 默认不带条件查询
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.sellmsgUrl+'/search',
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        /* start: start,
        point: point,
        areacatid: areacatid */
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