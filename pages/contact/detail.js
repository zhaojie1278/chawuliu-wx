//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item:{
      id:0,
      image: '',
      company: "",
      address:'',
      phone:'',
      descri: '',
      img1:'',
      img2:'',
      img3:'',
      img4:'',
      zhuanxians:[
        [
        {
          start:'',
          point:''
        },
        {
          start:'合肥',
          point:'上海2'
        }],
        [{
          start:'合肥',
          point:'上海3'
        },
        {
          start:'合肥',
          point:'上海4'
        }],
        [{
          start:'合肥',
          point:'上海5'
        }],
      ],
      isfav:false
    }
  },
  onLoad: function ($query) {

    var pages = getCurrentPages();
    // console.log(pages)
    if(pages.length > 1){
        //上一个页面实例对象
        var prePage = pages[pages.length - 2];

        console.log(prePage.route);
        //关键在这里
        // prePage.changeData(e.detail.value)
    }

    
    // console.log(this.data);
    // 加载中
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    var that = this;

    // 用户头像
    that.getUserInfoThis();

    var cid = $query.id
    var openid = wx.getStorageSync('openid')
    if (!openid) {
      util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
      return;
    }

    wx.request({
      url: app.globalData.config.service.contactUrl,
      data: {
        cid: cid,
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
          that.setData({
            item: res.data.data
          })
        }
        // console.log(res);
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
    console.log(e.currentTarget.dataset.src);
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
  getUserInfoThis:function(e) { // 获取用户信息
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
          var itemData = that.data.item;
          itemData.isfav = !isfav;
          that.setData({
            item : itemData
          })
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
