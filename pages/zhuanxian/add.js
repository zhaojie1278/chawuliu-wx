//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    item:{
      start_prov:'',
      start:'',
      point_prov:'',
      point:'',
      price_zhonghuo:'',
      price_paohuo:'',
      nickname:'',
      phone:'',
      address:'',
      cid: 0
    },
    form_type: 'submit',
    disabled: false,
    plain: false,
    loading: false,
    defaultsize: 'default'
  },
  onLoad: function () {
    // console.log(app.globalData)
    // 获取已保存信息
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    console.log('a');
    
    var that = this

    // 判断是否已添加公司信息
    var openid = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.config.service.contactUrl+'/isregcompany',
      data: {
        openid: openid
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
        if(res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，请先完善公司信息',
            icon: 'none',
            duration: 3000,
            success: function(e) {
              // console.log('toast')
              // console.log(e);
              // 完善公司信息
              setTimeout(
                function() {
                  wx.redirectTo({
                    url: '../contact/company'
                  })
              },1000)
              
            }
          })
        } else {
          var itemVal = that.data.item
          // console.log(itemVal)
          itemVal.cid = res.data.data.id;
          itemVal.nickname = res.data.data.nickname;
          itemVal.phone = res.data.data.phone;
          itemVal.address = res.data.data.address;
          that.setData({item:itemVal})
        }
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
  },
  formSubmit:function(e){
    wx.showLoading({
      title: '正在提交...',
      mask:true
    })

    self=this
    //图片
    var imglist = self.data.imglist

    // console.log(e)

    // 提交校验
    var formdata = e.detail.value
    if(formdata.start==''){
      util.showMaskTip1500('出发地不能为空')
    } else if (formdata.point == '') {
      util.showMaskTip1500('目的地不能为空')
    } else if (formdata.price_zhonghuo == '') {
      util.showMaskTip1500('重货价格不能为空')
    } else if (formdata.price_paohuo == '') {
      util.showMaskTip1500('泡货价格不能为空')
    } else if (formdata.nickname == '') {
      util.showMaskTip1500('联系人不能为空')
    } else if (formdata.phone == '') {
      util.showMaskTip1500('手机号码不能为空')
    } else if (formdata.address == '') {
      util.showMaskTip1500('地址不能为空')
    } else if (formdata.cid == '') {
      util.showMaskTip1500('抱歉，联系人信息异常，请重新加载后重试')
    } else {
      //提交
      var reqUrl = app.globalData.config.service.zhuanxianUrl+'/add';
      wx.request({
        url: reqUrl,
        method: 'POST',
        dataType: 'json',
        header: {
          sign: 'sign123123',
          ver: 'v1',
          "content-type": "application/x-www-form-urlencoded"
        },
        data: formdata,
        success: function(res){
          wx.hideLoading();
          if(res.data.status !== 1) {
            util.showError(res.data.message)
          } else {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function(res) {
                // console.log(res)
                setTimeout(
                  function() {
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                },1000)
              }
            })
          }
        },
        fail: function(res) {
          util.showError('抱歉，数据地址请求错误.v02')
          console.log('fail');
          // coonsole.log(res);
        },
        complete: function(res) {
          console.log('complete');
          // console.log(res)
        }
      })
    }
  },
  toSelectStart (e) {
    // TODO province
    wx.navigateTo({
      url:"../city/index?direction=item.start"
    })
  },
  toSelectPoint (e) {
    wx.navigateTo({
      url:"../city/index?direction=item.point"
    })
  },
  changeCity (e) {
    console.log('changeCity')
    // 选中的城市值赋值
    console.log(e)
    var setCityDirection = e.direction
    if (setCityDirection == 'item.start') {
      this.setData({
        'item.start': e.city,
        'item.start_prov': e.prov
      })
    } else {
      this.setData({
        'item.point': e.city,
        'item.point_prov': e.prov
      })
    }
  }
})
