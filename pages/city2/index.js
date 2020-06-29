    //index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
var provinceCallCity = {
  '北京市':'',
  '上海市':'',
  '天津市':'',
  '重庆市':''
}

// 引入Promise
import Promise from '../../vendors/es6-promise.js';

// console.log(app);
Page({
  data: {
      provinces: [
        {areaname: "北京", code: "110000"},
      ],
      citys:[
        {areaname: "辖区", code: "110100"}
      ],
      areas:[
        {areaname: "辖区", code: "110101"}
      ],
      defAreas:[
        {areaname: "辖区", code: "110101"}
      ],
      direction: '',
      selectedProv: '',
      selectedCity: '',
      selectedArea: '',
      zxCat: 1,
      winHeight: 0,
      toProvView: '',
      toCityView: '',
      toDistrictView: '',
      scrollProvTop: 0,
      scrollCityTop: 0,
      scrollDistrictTop: 0,
      nowCity:0,
      nowProv:0,
      nowDistrict:0,
      funScrollProvTopVal: 0,
      funScrollCityTopVal: 0,
      funScrollDisctrictTopVal: 0
  },
  onLoad: function (e) {

    // 用于从选择地区界面返回后不获取当前位置
    wx.setStorage({key:'isCityReturn',data:true});

    var that = this;

    var winHeight = 0
    var res = wx.getSystemInfoSync()
    winHeight = res.windowHeight
    console.log('winHeight::',winHeight)
    winHeight = winHeight - 55;
    that.setData({
      winHeight: winHeight
    })
    console.log('winHeight::',winHeight)

    console.log('city2.js -- onload e start')
    console.log(e);
    console.log('city2.js -- onload e end')
    if (undefined != e.cat) {
      that.setData({
        zxCat: e.cat
      })
    }
    that.setData({
      direction: e.direction,
    })

    // 首次加载获取定位和对应身份及城市，地区
    that.getCountryFun();
  },
  getCountryFun() {
    var that = this
    // 先获取定位数据，再获取省市数据
    var pGetLocation = new Promise(function(suc, fail){
      that.getNowLocation(suc,fail);
    });
    pGetLocation.then(this.getProvinceFun).catch(function(res){
      wx.showToast({
        title: '当前定位获取失败',
        icon: 'none'
      })
    });
  },
  getProvinceFun() {
    var that = this;
    console.log('getProvinceFun....');
    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatPeizai) {
      that.getProvince(); // 获取所有省
    } else if (that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun) {
      // 空运/海运 查询国外的
      if (that.data.direction.indexOf('start')!=-1) {
        that.getProvince(); // 获取国内省
      } else {
        that.getForeign(); // 获取国外省
      }
    } else {
      that.getProvince(); // 获取所有省
    }
  },
  bindProvScrollFun (e) {
    // 滚动时触发，指定 scroll-top 或者 scroll-into-view 时同样会触发
    // console.log('bindscroll::',e)
    this.setData({
      funScrollProvTopVal: e.detail.scrollTop
    });
  },
  bindCityScrollFun (e) {
    // 滚动时触发，指定 scroll-top 或者 scroll-into-view 时同样会触发
    // console.log('bindscroll::',e)
    this.setData({
      funScrollCityTopVal: e.detail.scrollTop
    });
  },
  bindDisctrictScrollFun (e) {
    // 滚动时触发，指定 scroll-top 或者 scroll-into-view 时同样会触发
    // console.log('bindscroll::',e)
    this.setData({
      funScrollDistrictTopVal: e.detail.scrollTop
    });
  },
  getProvince: function(e) {
    var allProvincesCode = '0'
    console.log('in getProvince')
    /*wx.showLoading({
      title: '加载中',
      mask: true
    })*/
    var that = this;
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
            that.setData({
              provinces:provinces
            })
            var codeArea = util.getCodeByArea(provinces, that.data.nowProv)
            if (!codeArea) {
              var getCityParams = {
                province: provinces[0]['areaname'],
                provinceCode: provinces[0]['code']
              }
            } else {
              var code = codeArea.code
              var getCityParams = {
                province: codeArea.areaname,
                provinceCode: code
              }
              var pSetData = new Promise(function(suc,fail) {
                that.setData({
                  toProvView: 'prov_vid_'+code,
                })
                suc()
              })
              /*pSetData.then(function(res) {
                setTimeout(function(){
                  that.setData({
                    scrollProvTop: that.data.funScrollProvTopVal-10
                  })
                },800)
              });*/
            }
            that.getCity(getCityParams);
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
  },
  getForeign: function(e) {
    var allProvincesCode = '0'
    console.log('getForeign')
    /*wx.showLoading({
      title: '加载中',
      mask: true
    })*/
    var that = this;
    // console.log(that.data);
    // var _storagedProvinces = wx.getStorageSync('provinces');
    var _storagedProvinces = false;
    if (!_storagedProvinces || _storagedProvinces.length == 0) {
      console.log('!!!')
      wx.request({
        url: app.globalData.config.service.cityApi+'getforeignfirst',
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
            that.setData({
                provinces:provinces
            });
            var codeArea = util.getCodeByArea(provinces, that.data.nowProv)
            if (!codeArea) {
              var getCityParams = {
                province: provinces[0]['areaname'],
                provinceCode: provinces[0]['code']
              }
            } else {
              var code = codeArea.code;
              var getCityParams = {
                province: codeArea.areaname,
                provinceCode: code
              }
              var pSetData = new Promise(function(suc,fail) {
                that.setData({
                  toProvView: 'prov_vid_'+code,
                })
                suc()
              })
              /*pSetData.then(function(res) {
                setTimeout(function(){
                  that.setData({
                    scrollProvTop: that.data.funScrollProvTopVal-10
                  })
                },800)
              });*/
            }            
            that.getCity(getCityParams);
            // wx.setStorageSync('foreignfirsts', resultGroup)
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
      })
    }
  },
  getCity: function(e) {
    if (undefined==e || (e.provinceCode == undefined)) { // ???
      return;
    }
    // console.log(e.currentTarget);
    var that = this;
    console.log('that.data.zxCat::'+that.data.zxCat)

    var isShengnei = false
    if (undefined != e.isShengnei) {
        isShengnei = true
    }
    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatPeizai) {
      // 省际
      // that.sureProvince(e)
      // return
    }
    // 当前选中省份赋值
    var eProvince = undefined != e.currentTarget ? e.currentTarget.dataset.province : e.province
    console.log('eProvince',eProvince)

    var eProvinceCode = undefined != e.currentTarget ? e.currentTarget.dataset.provinceCode : e.provinceCode
    that.setData({
      selectedProv: eProvince
    })

    var provinceCode = eProvinceCode
    // console.log(provinceCode);
    var allProvincesCode = '0'
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // console.log(that.data);
    // var _storagedCitys = wx.getStorageSync('city-'+provinceCode);
    var _storagedCitys = false;
    // console.log(_storagedCitys);
    if (!_storagedCitys) {
      var url = '';
      // console.log('that.data.direction::'+that.data.direction);
      var directionData = that.data.direction;
      if (directionData.indexOf('point')!=-1 && (that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun)) 
      {
        url = app.globalData.config.service.cityApi+'getforeignsecond?code='+provinceCode;
      } else {
        url = app.globalData.config.service.cityApi+'getcity?code='+provinceCode;
      }
      wx.request({
        url: url,
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
            console.log('citys',citys);

            console.log('citys----'+citys.length);
            if (citys == undefined || citys.length == 0) {
              that.sureProvince(e) // 20180430 省、市、县
              return
            }
            // var citysUpdated = citys.slice();
            /*citysUpdated.map(val => {
              val.fullNameDot = val.fullName.replace('市','');
            });*/
            var len=citys.length
            console.log('city2---len::'+len)
            console.log('citys',citys)
            that.setData({
                citys: citys
            });

            var codeCity = util.getCodeByArea(citys, that.data.nowCity)
            console.log('city--code,',codeCity);
            if (!codeCity) {
              that.setData({
                areas: citys[0]['areas'] ? citys[0]['areas']: that.data.defAreas,
                selectedCity: citys[0]['areaname'],
                selectedArea: citys[0]['areas'] ? citys[0]['areas'][0]['areaname'] : '',
              })
            } else {
              var areas = codeCity.areas;
              var cityName = codeCity.areaname;

              that.setData({
                areas: areas ? areas: that.data.defAreas,
                selectedCity: cityName,
              })

              var codeDistrict = util.getCodeByArea(areas, that.data.nowDistrict)
              if (!codeDistrict) {
                that.setData({
                  selectedArea: areas ? areas[0]['areaname'] : ''
                })
              } else {
                var districtName = codeDistrict.areaname;
                that.setData({
                  selectedArea: districtName
                })
              }
              var pSetData = new Promise(function(suc,fail) {
                that.setData({
                  toCityView: 'city_vid_'+codeCity.code,
                  toDistrictView: 'area_vid_'+codeDistrict.code,
                })
                suc()
              })
              /*pSetData.then(function(res) {
                setTimeout(function(){
                  that.setData({
                    scrollCityTop: that.data.funScrollCityTopVal-10,
                    scrollDistrictTop: that.data.funScrollDistrictTopVal-10
                  })
                },800)
              });*/
            }
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
    } else {
      wx.hideLoading();
      that.setData({
        citys:_storagedCitys,
      })
    }

    if (that.data.zxCat == app.globalData.zxCatShengnei) {
      that.setData({
        // citys:_storagedCitys,
      })
    }
    // console.log(that.data);
  },
  getArea: function(e) {
    if (!e.currentTarget.dataset.city) {
      return;
    }
    // 县
    var that = this;
    console.log('that.data.zxCat::'+that.data.zxCat)
    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun || that.data.zxCat == app.globalData.zxCatPeizai) {
      // 省际
      // that.sureCity(e) // 20180430 省、市、县
      // return
    } else if (that.data.zxCat == app.globalData.zxCatShengnei) {
      // 省内
      // that.sureCity(e) // 20180430 省、市、县
      // return
    }
    // 当前选中省份赋值
    that.setData({
      selectedCity: e.currentTarget.dataset.city
    })
    var cityCode = e.currentTarget.dataset.cityCode
    // console.log(cityCode);
    /*wx.showLoading({
      title: '加载中',
      mask: true
    })*/

    var isShinei = false
    if (undefined != e.isShinei) {
      isShinei = true
    }

    var reqUrl = app.globalData.config.service.cityApi+'getarea?code='+cityCode;
    // 直辖市处理
    /*if (that.data.zxCat == app.globalData.zxCatShinei) {
      if (e.currentTarget.dataset.city in provinceCallCity) {
        console.log('直辖市-------------------')
        // var reqUrl = app.globalData.config.service.cityApi+'getcity?code='+cityCode;
      }
    }*/

    // console.log(that.data);
    // var _storagedAreas = wx.getStorageSync('area-'+cityCode);
    var _storagedAreas = false;
    // console.log(_storagedAreas);
    if (!_storagedAreas) {
      wx.request({
        url: reqUrl,
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
            var selectedArea;
            console.log('areas----'+areas.length);
            if (areas == undefined || areas.length == 0) {
              // console.log(e);
              // that.sureCity(e) // 20180430 省、市、县
              // return
              // 
              areas = that.data.defAreas;
              selectedArea = '';
            } else {
              selectedArea = areas[0]['areaname']
            }

            // wx.setStorageSync('area-'+cityCode, areas)
            that.setData({
              areas:areas,
              selectedArea: selectedArea,
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
      })
    }
    // console.log(that.data);
  },
  returnProvinceFun () {
    this.setData({
    })
  },
  returnCityFun () {
    this.setData({
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
      selectedProv: prov,
      selectedCity: '',
      selectedArea: ''
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
      selectedProv: prov,
      selectedCity: city,
      selectedArea: ''
    }
    prePage.changeCity(returnData)
    // console.log(prePage)
    console.log('sureCity done')
    // 返回上一页
    wx.navigateBack()
  },
  sureArea: function(e) {
    console.log('sureArea')
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
      selectedProv: prov,
      selectedCity: city,
      selectedArea: area
    }
    prePage.changeCity(returnData)
    // console.log(prePage)
    console.log('sureCity done')
    // 返回上一页
    wx.navigateBack()
  },
  provinceTap: function(e) {
    console.log('prov',e.currentTarget.dataset)
    var province = e.currentTarget.dataset.province;
    var getCityParams = {
      province: province,
      provinceCode: e.currentTarget.dataset.provinceCode
    }
    this.getCity(getCityParams);
  },
  cityTap: function(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var tapCity = e.currentTarget.dataset.city
    if (tapCity != this.data.selectedCity) {
      this.getArea(e);
    }
  },
  areaTap: function(e) {
    var tapArea = e.currentTarget.dataset.area
    if (tapArea != this.data.selectedArea) {
      this.setData({
        selectedArea: tapArea
      })
    }
  },
  cityCancelTap: function(e) {
    this.setData({
      selectedCity: '',
      selectedArea: ''
    })
  },
  areaCancelTap: function(e) {
    this.setData({
      selectedArea: ''
    })
  },
  sureDistrictFun: function(e) {
    // 改变上一页的值
    var prov = this.data.selectedProv
    var city = this.data.selectedCity
    var area = this.data.selectedArea
    var pages = getCurrentPages()
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
    } else {
      var prePage = pages[0]
    }
    var returnData = {
      direction: this.data.direction,
      selectedProv: prov,
      selectedCity: city,
      selectedArea: area
    }
    prePage.changeCity(returnData)
    console.log('sureDistrictFun done')
    wx.navigateBack()
  },
  getNowLocation: function(promiseSuc,promiseFail) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // 调用百度API获取位置具体地址名
        wx.request({
          url: app.globalData.config.service.baiduApi+'&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll', 
          data: {},
          header: { 'Content-Type': 'application/json' },
          success: function(res) {
            if(res.data.status==0) {
              var provStr = res.data.result.addressComponent.province
              // provStr = '安徽省'
              if (provStr.indexOf('市')!=-1){
                provStr = provStr.replace(/(.*)市/, '$1')
              }
              if (provStr.indexOf('省')!=-1){
                provStr = provStr.replace(/(.*)省/, '$1')
              }
              var cityStr = res.data.result.addressComponent.city
              // cityStr = '合肥市'
              if (cityStr.indexOf('市')!=-1 && cityStr.length>2){
                cityStr = cityStr.replace(/(.*)市/, '$1')
              }
              var districtStr = res.data.result.addressComponent.district
              // districtStr = '蜀山区'
              // 
              // str.replace(/(.*)and/, '$1but');
              if (districtStr.indexOf('区')!=-1 && districtStr.length>2){
                districtStr = districtStr.replace(/(.*)区/, '$1')
              }
              // 
              
              that.setData({
                nowCity:cityStr,
                nowProv:provStr,
                nowDistrict:districtStr,
              })

              if (provStr == cityStr) {
                // 直辖市的名称作为省份、区作为市
                that.setData({
                  nowCity: '辖区',
                })
              }

              // 返回给 Promise 成功调用
              console.log('getlocation callback......')
              promiseSuc()
            } else {
              promiseFail()
            }
          }
        })
      }
    })
  }
})
