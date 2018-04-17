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
      hideReturnProv: true,
      hideReturnCity: true,
      direction: '',
      setedProv: '',
      setedCity: '',
      zxCat: 1
  },
  onLoad: function (e) {
    var that = this;
    console.log('city.js -- onload e start')
    console.log(e);
    console.log('city.js -- onload e end')
    if (undefined != e.cat) {
      that.setData({
        zxCat: e.cat
      })
    }
    that.setData({
      direction: e.direction,
    })

    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun || that.data.zxCat == app.globalData.zxCatPeizai) {
      // console.log('that.data.zxCat:::'+that.data.zxCat)
      that.getProvince(); // 获取所有省
    } else {
      if (that.data.zxCat == app.globalData.zxCatShengnei || that.data.zxCat == app.globalData.zxCatShinei) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        var nowAreaVal = e.nowAreaVal
        var nowAreaCatStr = e.nowAreaCatStr
        // console.log(e);
        wx.request({
          url: app.globalData.config.service.cityApi+'getcode?areaname='+nowAreaVal+'&areacat='+nowAreaCatStr,
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
              return;
            } else {
              var nowAreaCode = res.data.data.code
              console.log('code::'+nowAreaCode)
              if (that.data.zxCat == app.globalData.zxCatShengnei) {
                var eData = {
                  currentTarget: {
                    dataset: {
                      province: nowAreaVal,
                      provinceCode: nowAreaCode
                    }
                  },
                  isShengnei: 1
                }
                that.getCity(eData)
                return
              } else if (that.data.zxCat == app.globalData.zxCatShinei) {
                var eData = {
                  currentTarget: {
                    dataset: {
                      city: nowAreaVal,
                      cityCode: nowAreaCode
                    }
                  },
                  isShinei: 1
                }
                that.getArea(eData)
                return
              }

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
        return
      }
    }
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
    // var _storagedProvinces = wx.getStorageSync('provinces');
    var _storagedProvinces = false;
    if (!_storagedProvinces || _storagedProvinces.length == 0) {
      console.log('!!!')
      wx.request({
        url: app.globalData.config.service.cityApi+'getprovin',
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
              /*var fullNameVal = provinces[i].fullName;
              if (fullNameVal.indexOf('内蒙古') != -1 || fullNameVal.indexOf('黑龙江') != -1) {
                provinces[i].fullName = provinces[i].fullName.slice(0, 3)
              } else {
                provinces[i].fullName = provinces[i].fullName.slice(0, 2)
              }*/
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
              hideReturnProv: true,
              hideReturnCity: true,
              isProvinceShow: true,
              isCityShow: false,
              isAreaShow: false
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
        hideReturnProv: true,
        hideReturnCity: true,
        isProvinceShow: true,
        isCityShow: false,
        isAreaShow: false
      })
    }
    // console.log(that.data);
  },
  getCity: function(e) {
    // console.log(e.currentTarget);
    var that = this;
    console.log('that.data.zxCat::'+that.data.zxCat)

    var isShengnei = false
    if (undefined != e.isShengnei) {
        isShengnei = true
    }
    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun || that.data.zxCat == app.globalData.zxCatPeizai) {
      // 省际
      that.sureProvince(e)
      return
    }
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
    // var _storagedCitys = wx.getStorageSync('city-'+provinceCode);
    var _storagedCitys = false;
    // console.log(_storagedCitys);
    if (!_storagedCitys) {
      wx.request({
        url: app.globalData.config.service.cityApi+'getcity?code='+provinceCode,
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
            /*citysUpdated.map(val => {
              val.fullNameDot = val.fullName.replace('市','');
            });*/
            var resultGroup = [];
            var len=citysUpdated.length
            for(var i=0;i<len;i+=4){
              resultGroup.push(citysUpdated.slice(i,i+4));
            }
            // console.log(provinces);
            wx.setStorageSync('city-'+provinceCode, resultGroup)
            
            that.setData({
              citys:resultGroup,
              hideReturnProv: isShengnei ? true : false,
              hideReturnCity: true,
              isProvinceShow: false,
              isCityShow: true,
              isAreaShow: false
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
        hideReturnProv: false,
        hideReturnCity: true,
        isProvinceShow: false,
        isCityShow: true,
        isAreaShow:false,
      })
    }

    if (that.data.zxCat == app.globalData.zxCatShengnei) {
      that.setData({
        // citys:_storagedCitys,
        hideReturnProv: true,
        // hideReturnCity: true,
        // isProvinceShow: false,
        // isCityShow: true,
        // isAreaShow:false,
      })
    }
    // console.log(that.data);
  },
  getArea: function(e) {
    // 县
    var that = this;
    console.log('that.data.zxCat::'+that.data.zxCat)
    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun || that.data.zxCat == app.globalData.zxCatPeizai) {
      // 省际
      
    } else if (that.data.zxCat == app.globalData.zxCatShengnei) {
      // 省内
      that.sureCity(e)
      return
    }
    // 当前选中省份赋值
    that.setData({
      setedCity: e.currentTarget.dataset.city
    })
    var cityCode = e.currentTarget.dataset.cityCode
    // console.log(cityCode);
    console.log('getProvince')
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var isShinei = false
    if (undefined != e.isShinei) {
      isShinei = true
    }
    // console.log(that.data);
    // var _storagedAreas = wx.getStorageSync('area-'+cityCode);
    var _storagedAreas = false;
    // console.log(_storagedAreas);
    if (!_storagedAreas) {
      wx.request({
        url: app.globalData.config.service.cityApi+'getarea?code='+cityCode,
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
            var areas = res.data.data

            // var citysUpdated = citys.slice();
            /*citysUpdated.map(val => {
              val.fullNameDot = val.fullName.replace('市','');
            });*/
            var resultGroup = [];
            var len=areas.length
            for(var i=0;i<len;i+=4){
              resultGroup.push(areas.slice(i,i+4));
            }
            // console.log(provinces);
            wx.setStorageSync('area-'+cityCode, resultGroup)
            that.setData({
              areas:resultGroup,
              hideReturnProv: true,
              hideReturnCity: isShinei ? true : false,
              isProvinceShow: false,
              isCityShow: false,
              isAreaShow: true,
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
        areas:_storagedAreas,
        hideReturnProv: true,
        hideReturnCity: false,
        isProvinceShow: false,
        isCityShow: false,
        isAreaShow: true,
      })
    }
    // console.log(that.data);
  },
  returnProvinceFun () {
    this.setData({
      hideReturnProv: true,
      hideReturnCity: true,
      isProvinceShow: true,
      isCityShow: false,
      isAreaShow: false
    })
  },
  returnCityFun () {
    this.setData({
      hideReturnProv: false,
      hideReturnCity: true,
      isProvinceShow: false,
      isCityShow: true,
      isAreaShow: false
    })
  },
  sureProvince: function(e) {
    console.log('sureProv')
    // 改变上一页的值
    var prov = e.currentTarget.dataset.province
    // var city = e.currentTarget.dataset.city
    var pages = getCurrentPages()
    console.log('pages')
    console.log(pages.length)
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
    } else {
      var prePage = pages[0]
    }
    var returnData = {
      direction: this.data.direction,
      returnVal: prov,
      // city: city
    }
    prePage.changeCity(returnData)
    // console.log(prePage)
    console.log('sureCity done')
    // 返回上一页
    wx.navigateBack()
  },
  sureCity: function(e) {
    console.log('sureCity')
    // 改变上一页的值
    var prov = e.currentTarget.dataset.province
    var city = e.currentTarget.dataset.city
    var pages = getCurrentPages()
    console.log('pages')
    console.log(pages.length)
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
    } else {
      var prePage = pages[0]
    }
    var returnData = {
      direction: this.data.direction,
      returnVal: city
    }
    prePage.changeCity(returnData)
    // console.log(prePage)
    console.log('sureCity done')
    // 返回上一页
    wx.navigateBack()
  },
  sureArea: function(e) {
    console.log('sureProv')
    // 改变上一页的值
    var prov = e.currentTarget.dataset.province
    var city = e.currentTarget.dataset.city
    var area = e.currentTarget.dataset.area
    var pages = getCurrentPages()
    console.log('pages')
    console.log(pages.length)
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
    } else {
      var prePage = pages[0]
    }
    var returnData = {
      direction: this.data.direction,
      returnVal: area
    }
    prePage.changeCity(returnData)
    // console.log(prePage)
    console.log('sureCity done')
    // 返回上一页
    wx.navigateBack()
  }
})
