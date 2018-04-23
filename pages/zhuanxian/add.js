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
      catname: ''
    },
    cats: [],
    defAreaCat: 0,
    form_type: 'submit',
    disabled: false,
    plain: false,
    loading: false,
    defaultsize: 'default'
  },
  onLoad: function (e) {

    console.log('zx--addd')
    // console.log(defAreaCat);
    // console.log(e)
    var that = this

    // 专线分类可选
    that.setData({
      cats: app.globalData.zxCatsKeyVal
    })

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: app.globalData.zxCatsKeyVal[e.catid]
    })
    
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    that.getNowLocation();
    // 判断是否已添加公司信息
    var openid = wx.getStorageSync('openid')
    if(undefined != e && undefined != e.catid && undefined == e.zxid) {
      // 添加专线入口
      that.setData({
        defAreaCat: e.catid
      })

      if (e.catid == app.globalData.zxCatPeizai) {
        // 配置调车可一次添加多个
        that.setData({
          isPeizai: true,
          isPeizaiUpdate: false
        })
      }

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
            // itemVal.cats = ;
            itemVal.catname = app.globalData.zxCatsKeyVal[that.data.defAreaCat]
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
          if(res.data.status !== 1 || null == res.data.data) {
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
            var _cat = res.data.data.cat // 本地数组索引小于1
            itemVal.catname = app.globalData.zxCatsKeyVal[_cat]
            that.setData({
              item:itemVal,
              defAreaCat: _cat
            })
            // console.log(that)
            // 
            if (e.catid == app.globalData.zxCatPeizai) {
              // 配置调车可一次添加多个
              that.setData({
                isPeizai: true,
                isPeizaiUpdate: true
              })
            }
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
    } else {
      util.showError('抱歉，数据异常')
      return
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
    console.log('formdata::')
    console.log(formdata);
    console.log(formdata.price_zhonghuo);
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

                // if (formdata.id) {
                  wx.redirectTo({url: '../contact/zhuanxians'})
                // }
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
    console.log('this.data.item.cat::'+this.data.defAreaCat);

    var nowAreaVal = '';
    var nowAreaCatStr = '';
    // console.log(this.data);
    if (this.data.defAreaCat == app.globalData.zxCatShengnei) {
        nowAreaVal = this.data.nowProv
        nowAreaCatStr = 'province'
    } else if (this.data.defAreaCat == app.globalData.zxCatShinei) {
        nowAreaVal = this.data.nowCity
        nowAreaCatStr = 'city'
    }

    this.setData({
      'item.start_prov': this.data.nowProv,
      'item.start_city': this.data.nowCity
    })
    // 选择出发地
    wx.navigateTo({
      url:"../city/index?direction=item.start&cat="+this.data.defAreaCat+"&nowAreaVal="+nowAreaVal+"&nowAreaCatStr="+nowAreaCatStr
    })
  },
  toSelectPoint (e) {
    var nowAreaVal = '';
    var nowAreaCatStr = '';
    // console.log(this.data);
    if (this.data.defAreaCat == app.globalData.zxCatShengnei) {
        nowAreaVal = this.data.nowProv
        nowAreaCatStr = 'province'
    } else if (this.data.defAreaCat == app.globalData.zxCatShinei) {
        nowAreaVal = this.data.nowCity
        nowAreaCatStr = 'city'
    }

    var eTargetId = e.currentTarget.id;
    var pointDirection = 'item.point';
    if (eTargetId == 'point2') {
      pointDirection = 'item.point2';
      this.setData({
        'item.point_prov2': this.data.nowProv,
        'item.point_city2': this.data.nowCity
      })
    } else if (eTargetId == 'point3') {
      pointDirection = 'item.point3';
      this.setData({
        'item.point_prov3': this.data.nowProv,
        'item.point_city3': this.data.nowCity
      })
    } else if (eTargetId == 'point4') {
      pointDirection = 'item.point4';
      this.setData({
        'item.point_prov4': this.data.nowProv,
        'item.point_city4': this.data.nowCity
      })
    } else if (eTargetId == 'point5') {
      pointDirection = 'item.point5';
      this.setData({
        'item.point_prov5': this.data.nowProv,
        'item.point_city5': this.data.nowCity
      })
    } else {
      this.setData({
        'item.point_prov': this.data.nowProv,
        'item.point_city': this.data.nowCity
      })
    }
    console.log('this.data.nowCity::'+this.data.nowCity)
    // 选择目的地
    wx.navigateTo({
      url:"../city/index?direction="+pointDirection+"&cat="+this.data.defAreaCat+"&nowAreaVal="+nowAreaVal+"&nowAreaCatStr="+nowAreaCatStr
    })
  },
  changeCity (e) {
    console.log('changeCity')
    // 选中的城市值赋值
    console.log(e)
    var setCityDirection = e.direction
    if (setCityDirection == 'item.start') {
      this.setData({
        /*'item.start': e.city,
        'item.start_prov': e.prov*/
        'item.start': e.returnVal
      })

      if (this.data.defAreaCat == app.globalData.zxCatShengji || this.data.defAreaCat == app.globalData.zxCatPeizai){
        this.setData({
          'item.start_prov': e.provVal
        })
      }
    } else {
      if(setCityDirection == 'item.point2') {
        if (this.data.defAreaCat == app.globalData.zxCatShengji || this.data.defAreaCat == app.globalData.zxCatPeizai){
          this.setData({
            'item.point_prov2': e.provVal
          })
        }
        this.setData({
          'item.point2': e.returnVal
        })
      } else if (setCityDirection == 'item.point3') {
        if (this.data.defAreaCat == app.globalData.zxCatShengji || this.data.defAreaCat == app.globalData.zxCatPeizai){
          this.setData({
            'item.point_prov3': e.provVal
          })
        }
        this.setData({
          'item.point3': e.returnVal
        })
      } else if (setCityDirection == 'item.point4') {
        if (this.data.defAreaCat == app.globalData.zxCatShengji || this.data.defAreaCat == app.globalData.zxCatPeizai){
          this.setData({
            'item.point_prov4': e.provVal
          })
        }
        this.setData({
          'item.point4': e.returnVal
        })
      } else if (setCityDirection == 'item.point5') {
        if (this.data.defAreaCat == app.globalData.zxCatShengji || this.data.defAreaCat == app.globalData.zxCatPeizai){
          this.setData({
            'item.point_prov5': e.provVal
          })
        }
        this.setData({
          'item.point5': e.returnVal
        })
      } else {
        this.setData({
          /*'item.point': e.city,
          'item.point_prov': e.prov*/
          'item.point': e.returnVal
        })
        if (this.data.defAreaCat == app.globalData.zxCatShengji || this.data.defAreaCat == app.globalData.zxCatPeizai){
          this.setData({
            'item.point_prov': e.provVal
          })
        }
      }
    }
  },
  bindCatsChange (e) {
    this.setData({
      "item.catname": this.data.cats[e.detail.value]
    })
    console.log('this.data.item.catname::'+this.data.item.catname)
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
              
              that.setData({
                nowCity:cityStr,
                nowProv:provStr,
                nowDistrict:districtStr,
              })              
            }
          }
        })
      }
    })
  }
})
