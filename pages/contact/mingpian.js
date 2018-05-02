//mingpian.js
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
      image: '', // ../../images/company/default.jpg
      domainimg1: '', // ../../images/company/default.jpg
      domainimg2: '', // ../../images/company/default.jpg
      domainimg3: '',
      domainimg4: '',
      company: "",
      address:'',
      phone:'',
      descri: '',
      img1:'',
      img2:'',
      img3:'',
      img4:'',
    },
    zxCatsKeyVal: app.globalData.zxCatsKeyVal
  },
  onError (e) {
    console.log('onerror:'+JSON.stringify(e));
    wx.showModal({
      title: 'onerror',
      content: JSON.stringify(e)
    })
  },
  onPageNotFound (e) {
    wx.showModal({
      title: 'onPageNotFound',
      content: JSON.stringify(e)
    })
  },
  onLoad: function (query) {
    // console.log(query);
    // 加载中
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    var that = this;
    // console.log(that.data.zxCatsKeyVal)

    var ooid = query.ooid
    if (ooid == undefined) {
      var openid = wx.getStorageSync('openid')
      if (!openid) {
        util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
        return;
      }
      ooid = openid
    } else {
      // 获取邀请人 openid 并设置到 app.globalData
      app.globalData.ooid = ooid
    }
    // console.log(ooid);
    

    wx.request({
      url: app.globalData.config.service.contactUrl+'/contactinfo',
      data: {
        openid: ooid
      },
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        if(res.data.status == 1) {
          var companyimgs = {
            'img1':res.data.data.domainimg1,
            'img2':res.data.data.domainimg2,
            'img3':res.data.data.domainimg3,
            'img4':res.data.data.domainimg4,
          }
          var imglists = {
            'img1':res.data.data.img1,
            'img2':res.data.data.img2,
            'img3':res.data.data.img3,
            'img4':res.data.data.img4,
          }
          
          that.setData({
            item: res.data.data,
          })
        } else {
          if (undefined == query.ooid) {
            wx.showModal({
              title: '提示',
              content: '抱歉，请先完善公司信息',
              showCancel: false,
              success: function(e) {
                wx.redirectTo({
                  url: '../contact/company'
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '当前名片已不存在，点击确定跳至首页',
              showCancel: false,
              success: function(e) {
                // console.log('toast')
                // console.log(e);
                // 完善公司信息
                // setTimeout(
                  // function() {
                  wx.switchTab({
                    url: '../index/index'
                  })
                // },3000)
              }
            })
          }
        }
        // console.log(that.data);
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v02',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        setTimeout(function(){
          wx.switchTab({
            url: '../index/index'
          })
        }, 3000);
        console.log('fail');
        // coonsole.log(res);
      },
      complete: function(res) {
        // console.log('complete');
        // console.log(res)
        wx.hideLoading();
      }
    })    
    // wx.hideLoading();
  },
  onShareAppMessage: function (res) { // 转发
    return this.shareFun(res)
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
  toFabu (e) {
    // 发布专线
    wx.switchTab({
      url: '../index/fabu'
    })
  },
  shareFun (res) { // 转发
    console.log(res);
    var openid = wx.getStorageSync('openid')
    console.log('oid:'+openid)
    var company = this.data.item.company
    return {
      title: company+'的小程序个人名片',
      path: '/pages/contact/mingpian?ooid='+openid,
      success: function(sharedRes) {
        // 转发成功
        /*wx.showToast({
          title: '发送成功',
          icon: 'none',
          duration: 2000
        })*/
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
