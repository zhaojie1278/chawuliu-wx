//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    item:{
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
    },
    sellCatsKeyVal: app.globalData.sellCatsKeyVal,
    selltypesKeyVal: app.globalData.selltypesKeyVal
  },
  onLoad: function ($query) {
    // console.log(this.data);
    // 加载中
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    var that = this;

    var id = $query.id
    var openid = wx.getStorageSync('openid')
    if (!openid) {
      util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
      return;
    }

    wx.request({
      url: app.globalData.config.service.sellmsgUrl+'/detail',
      data: {
        id: id,
        openid: openid
      },
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if (res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，请求失败，' + res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          res.data.data.price = res.data.data.price.toFixed(2);
          that.setData({
            item: res.data.data
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v04',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        console.log('fail');
        // coonsole.log(res);
      }
    })
    
    // wx.request({ 
      wx.hideLoading();
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
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
  ylImg:function(e) {
    // console.log(e.currentTarget.dataset.src);
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src], // 需要预览的图片http链接列表
      fail:function(e){
          // console.log(e);
          wx.showToast({
            title: '预览失败',
            icon: 'none',
            duration: 2000
          })
        }
    })
  },
  favcompany: function(e) {
    var that = this
    var openid = wx.getStorageSync('openid')
    if (!openid) {
      util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
      return;
    }
    var cid = e.currentTarget.dataset.id;
    var isfav = e.currentTarget.dataset.isfav;
    
    wx.showLoading({
        title: '请求中..',
        mask: true
    })

    wx.request({
      url: app.globalData.config.service.contactUrl + '/favcompany',
      data: {
        openid: openid,
        cid: cid,
        isfav: isfav
      },
      method: 'POST',
      header: {
        'content-type' : 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.status != 1) {
          util.showError('收藏失败，请稍后重试')
        } else {
          var isfavMsg = isfav ? '已取消收藏' : '收藏成功'
          util.showMaskSuccess(isfavMsg)
          // console.log('thatthatthatthat')
          // console.log(that)
          var itemData = that.data.item;
          itemData.isfav = !isfav;
          that.setData({
            item : itemData
          })

          // 处理收藏列表动态展示
          var pages = getCurrentPages();
          // console.log(pages)
          if(pages.length > 1){
              //上一个页面实例对象
              var prePage = pages[pages.length - 2];
              console.log('prePage.route::'+prePage.route)
              if (prePage.route && prePage.route == 'pages/contact/fav') {
                // 如果是收藏列表界面至此界面
                var returnData = {
                  isDoUnfav: isfav,
                  favItemIndex: that.data.favItemIndex,
                }
                prePage.changeFavitemHidden(returnData)
              }
              //关键在这里
              // prePage.changeData(e.detail.value)
          }
          
        }
      },
      fail: function() {
        wx.showToast({
          title: '请求失败 v03',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})
