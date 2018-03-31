    //index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

// console.log(app);
Page({
  data: {
      provinces: [
        [
          {'code':'340000','fullName':'安徽省'},
          {'code':'110000','fullName':'北京'}, 
          {'code':'110000','fullName':'北京'}, 
          {'code':'110000','fullName':'北京'}, 
        ],
        [
          {'code':'340000','fullName':'安徽省'},
          {'code':'110000','fullName':'北京'}, 
          {'code':'110000','fullName':'北京'}, 
          {'code':'110000','fullName':'北京'}, 
        ]
      ],
      citys:[
        [
          {'code':'340800','fullName':'安庆市'},
          {'code':'340100','fullName':'合肥市'}, 
          {'code':'340100','fullName':'合肥市'}, 
          {'code':'340100','fullName':'合肥市'}, 
        ],
        [
          {'code':'340800','fullName':'安庆市'},
          {'code':'340100','fullName':'合肥市'}, 
          {'code':'340100','fullName':'合肥市'}, 
          {'code':'340100','fullName':'合肥市'}, 
        ],
      ],
      isProvinceShow: true,
      hideReturn: true,
      direction: '',
      setedProv: ''
  },
  onLoad: function (e) {
    this.setData({
      direction: e.direction
    })
    this.getProvince(); // 获取所有省
    // this.getCitys(code); // 获取省份下面的市
  },
  getProvince: function(e) {

    var allProvincesCode = '0'
    console.log('getProvince')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    // console.log(that.data);
    var _storagedProvinces = wx.getStorageSync('provinces');
    if (!_storagedProvinces || _storagedProvinces.length == 0) {
      console.log('!!!')
      wx.request({
        url: app.globalData.config.service.cityApi+allProvincesCode,
        method: 'GET',
        dataType: 'json',
        success: function(res){
          wx.hideLoading();
          console.log(res);
          if(res.data.status != 1) {
            console.log(res.data.message)
            wx.showToast({
              title: '抱歉，数据请求失败',
              icon: 'none',
              // icon: 'loading',
              duration: 2000
            })
          } else {
            var provinces = res.data.data

            // 字符串处理展示
            var len=provinces.length
            var _group = Array();
            // console.log('len::'+len)
            for(var i=0;i<len;i++){
              var fullNameVal = provinces[i].fullName;
              if (fullNameVal.indexOf('内蒙古') != -1 || fullNameVal.indexOf('黑龙江') != -1) {
                provinces[i].fullName = provinces[i].fullName.slice(0, 3)
              } else {
                provinces[i].fullName = provinces[i].fullName.slice(0, 2)
              }
              _group.push(provinces[i])
            }
            // console.log(_group)
            var resultGroup = [];
            for(var i=0;i<len;i+=4){
              resultGroup.push(_group.slice(i,i+4));
            }

            // console.log(provinces);
            wx.setStorageSync('provinces', resultGroup)
            that.setData({
              provinces:resultGroup,
              hideReturn: true,
              isProvinceShow: true,
              isCityShow: false
            })
          }
          // console.log('success123')
        },
        fail: function(res) {
          wx.showToast({
            title: '抱歉，数据地址请求错误.v011',
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
    } else {
      wx.hideLoading();
      that.setData({
        provinces:_storagedProvinces,
        hideReturn: true,
        isProvinceShow: true,
        isCityShow: false
      })
    }
    // console.log(that.data);
  },
  getCity: function(e) {

    var that = this;
    // var setedProv = e.currentTarget.dataset.province
    // 当前选中省份赋值
    that.setData({
      setedProv: e.currentTarget.dataset.province
    })
    var provinceCode = e.currentTarget.dataset.provinceCode
    // console.log(provinceCode);
    var allProvincesCode = '0'
    console.log('getProvince')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // console.log(that.data);
    var _storagedCitys = wx.getStorageSync('city-'+provinceCode);
    // console.log(_storagedCitys);
    if (!_storagedCitys) {
      wx.request({
        url: app.globalData.config.service.cityApi+provinceCode,
        method: 'GET',
        dataType: 'json',
        success: function(res){
          wx.hideLoading();
          // console.log(res);
          if(res.data.status != 1) {
            console.log(res.data.message)
            wx.showToast({
              title: '抱歉，数据请求失败，请稍后重试',
              icon: 'none',
              // icon: 'loading',
              duration: 2000
            })
          } else {
            var citys = res.data.data

            var citysUpdated = citys.slice();
            citysUpdated.map(val => {
              val.fullNameDot = val.fullName.replace('市','');
            });
            var resultGroup = [];
            var len=citysUpdated.length
            for(var i=0;i<len;i+=4){
              resultGroup.push(citysUpdated.slice(i,i+4));
            }
            // console.log(provinces);
            wx.setStorageSync('city-'+provinceCode, resultGroup)
            that.setData({
              citys:resultGroup,
              hideReturn: false,
              isProvinceShow: false,
              isCityShow: true
            })
          }
          // console.log('success123')
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
    } else {
      wx.hideLoading();
      that.setData({
        citys:_storagedCitys,
        hideReturn: false,
        isProvinceShow: false,
        isCityShow: true
      })
    }
    // console.log(that.data);
  },
  returnProvinceFun () {
    this.setData({
      hideReturn: true,
      isProvinceShow: true,
      isCityShow: false
    })
  },
  sureCity: function(e) {
    console.log('sureCity')
    // 改变上一页的值
    var city = e.currentTarget.dataset.city
    var prov = e.currentTarget.dataset.prov
    var pages = getCurrentPages()
    var prePage = pages[0]
    var returnData = {
      direction: this.data.direction,
      prov: prov,
      city: city
    }
    prePage.changeCity(returnData)
    // console.log(prePage)
    console.log('sureCity done')
    // 返回上一页
    wx.navigateBack()
  }
})
