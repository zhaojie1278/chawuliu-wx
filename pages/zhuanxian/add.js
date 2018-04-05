//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')


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
      cid: 0,
      cats: [],
      catname: ''
    },
    defAreaCat: 0,
    form_type: 'submit',
    disabled: false,
    plain: false,
    loading: false,
    defaultsize: 'default'
  },
  onLoad: function (e) {

    console.log('addd')
    console.log(e)
    var that = this

    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    // 判断是否已添加公司信息
    var openid = wx.getStorageSync('openid')
    if(undefined != e && undefined != e.catid && undefined == e.zxid) {
      // 添加专线入口
      that.setData({
        defAreaCat: e.catid-1
      })

      // 判断是否已注册公司信息
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
            itemVal.cats = app.globalData.zxCatsKeyVal;
            itemVal.catname = itemVal.cats[that.data.defAreaCat-1]
            that.setData({item:itemVal})
            // console.log(that)
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

      return
    } else if (undefined != e && undefined != e.zxid) {
      console.log('upupdate')
      // 修改专线入口
      wx.request({
        url: app.globalData.config.service.zhuanxianUrl+'/toupdate',
        data: {
          id: e.zxid,
          cid: e.cid 
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
              title: '抱歉，数据获取失败，请稍后重试',
              icon: 'none',
              duration: 3000,
              success: function(e) {
                // console.log('toast')
                // console.log(e);
                // 完善公司信息
                setTimeout(
                  function() {
                    wx.navigateBack()
                },1000)
                
              }
            })
          } else {
            var itemVal = that.data.item
            // console.log(itemVal)
            itemVal.id = res.data.data.id;
            itemVal.start_prov = res.data.data.start_prov;
            itemVal.start = res.data.data.start;
            itemVal.point_prov = res.data.data.point_prov;
            itemVal.point = res.data.data.point;
            itemVal.price_zhonghuo = res.data.data.price_zhonghuo;
            itemVal.price_paohuo = res.data.data.price_paohuo;
            itemVal.cid = res.data.data.cid;
            itemVal.nickname = res.data.data.nickname;
            itemVal.phone = res.data.data.phone;
            itemVal.address = res.data.data.address;
            itemVal.cats = app.globalData.zxCatsKeyVal;
            var _cat = res.data.data.cat-1 // 本地数组索引小于1
            itemVal.catname = itemVal.cats[_cat]
            that.setData({
              item:itemVal,
              defAreaCat: _cat
            })
            // console.log(that)
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '抱歉，数据地址请求错误.v03',
            icon: 'none',
            duration: 2000
          })
          console.log('fail');
        },
        complete: function(res) {
          // console.log('complete');
          // console.log(res)
        }
      })
    }
    
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
      console.log('cat'+formdata.catname);
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
                self.setData({
                  'item.start_prov': '',
                  'item.start': '',
                  'item.point_prov': '',
                  'item.point': '',
                  'item.price_zhonghuo': '',
                  'item.price_paohuo': '',
                })

                if (formdata.id) {
                  wx.navigateTo({url: '../contact/zhuanxians'})
                }
                // console.log(res)
                // 添加成功后跳转
                /* setTimeout(
                  function() {
                    wx.switchTab({
                      url: '/pages/contact/index'
                    })
                },1000) */
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
    // 选择出发地
    wx.navigateTo({
      url:"../city/index?direction=item.start"
    })
  },
  toSelectPoint (e) {
    // 选择目的地
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
  },
  bindCatsChange (e) {
    this.setData({
      "item.catname": this.data.item.cats[e.detail.value]
    })
    console.log(this.data.item.catname)
  }
})
