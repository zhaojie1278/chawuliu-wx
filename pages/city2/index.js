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

// console.log(app);
Page({
  data: {
      provinces: [
        {areaname: "北京", code: "110000"},
        {areaname: "天津", code: "120000"},
        {areaname: "河北", code: "130000"},
        {areaname: "安徽", code: "340000"}
      ],
      citys:[
        {areaname: "合肥", code: "340100"},
        {areaname: "芜湖", code: "340200"},
        {areaname: "蚌埠", code: "340300"},
        {areaname: "淮南", code: "340400"},
        {areaname: "马鞍山", code: "340500"},
        {areaname: "淮北", code: "340600"}
      ],
      areas:[
        {areaname: "镜湖区", code: "340202"},
        {areaname: "弋江区", code: "340203"},
        {areaname: "鸠江区", code: "340207"},
        {areaname: "三山区", code: "340208"},
        {areaname: "芜湖县", code: "340221"}
      ],
      direction: '',
      selectedProv: '',
      selectedCity: '',
      selectedArea: '',
      zxCat: 1,
      picker_values: [1, 1, 1],
      winHeight: 0
  },
  onLoad: function (e) {
    var that = this;

    var winHeight = 0
    var res = wx.getSystemInfoSync()
    winHeight = res.windowHeight
    console.log('winHeight::',winHeight)
    winHeight = winHeight - 20;
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

    if (that.data.zxCat == app.globalData.zxCatShengji || that.data.zxCat == app.globalData.zxCatPeizai) {
      // console.log('that.data.zxCat:::'+that.data.zxCat)
      that.getProvince(); // 获取所有省
    } else if (that.data.zxCat == app.globalData.zxCatKongyun || that.data.zxCat == app.globalData.zxCatHaiyun) {
      // 空运/海运 查询国外的
      if (e.direction.indexOf('start')!=-1) {
        that.getProvince(); // 获取国内
      } else {
        that.getForeign(); // 获取国外
      }
    } else {
      that.getProvince(); // 获取所有省
      /*if (that.data.zxCat == app.globalData.zxCatShengnei || that.data.zxCat == app.globalData.zxCatShinei) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        var nowAreaVal = e.nowAreaVal
        var nowAreaCatStr = e.nowAreaCatStr
        if (that.data.zxCat == app.globalData.zxCatShinei) {
          if (nowAreaVal in provinceCallCity) {
            var nowAreaCatStr = 'province'
          }
        }
        
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
      }*/
    }
  },
  getProvince: function(e) {
    var allProvincesCode = '0'
    console.log('in getProvince')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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

            var getCityParams = {
              province: _group[0]['areaname'],
              provinceCode: _group[0]['code']
            }
            that.getCity(getCityParams);

            that.setData({
              provinces:_group,
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
  },
  getForeign: function(e) {
    var allProvincesCode = '0'
    console.log('getForeign')
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

            // 字符串处理展示
            var len=provinces.length
            var _group = Array();
            // console.log('len::'+len)
            for(var i=0;i<len;i++){
              _group.push(provinces[i])
            }

            // 控制对齐
            var glen = _group.length;
            if (glen%4 != 0) {
              var minusGlen = 4-glen%4;
              var emptyProvin = {areaname:'',code:''}
              for(var i=0;i<minusGlen;i++) {
                _group.push(emptyProvin)
              }
            }

            // console.log(_group)
            /*var resultGroup = [];
            for(var i=0;i<len;i+=4){
              resultGroup.push(_group.slice(i,i+4));
            }*/

            // console.log(provinces);
            // wx.setStorageSync('foreignfirsts', resultGroup)
            that.setData({
              provinces:_group,
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
      })
    }
  }
  ,
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
              citys: citys,
              areas: citys[0]['areas'],
              selectedCity: citys[0]['areaname'],
              selectedArea: citys[0]['areas'] ? citys[0]['areas'][0]['areaname'] : '',
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
    console.log('getProvince')
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var isShinei = false
    if (undefined != e.isShinei) {
      isShinei = true
    }

    var reqUrl = app.globalData.config.service.cityApi+'getarea?code='+cityCode;
    // 直辖市处理
    if (that.data.zxCat == app.globalData.zxCatShinei) {
      if (e.currentTarget.dataset.city in provinceCallCity) {
        var reqUrl = app.globalData.config.service.cityApi+'getcity?code='+cityCode;
      }
    }

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
            console.log('areas',areas);
            console.log('areas----'+areas.length);
            if (areas == undefined || areas.length == 0) {
              // console.log(e);
              that.sureCity(e) // 20180430 省、市、县
              return
            }

            // 控制对齐
            /*var glen = areas.length;
            if (glen%4 != 0) {
              var minusGlen = 4-glen%4;
              var emptyProvin = {areaname:'',code:''}
              for(var i=0;i<minusGlen;i++) {
                areas.push(emptyProvin)
              }
            }*/
            // var citysUpdated = citys.slice();
            /*citysUpdated.map(val => {
              val.fullNameDot = val.fullName.replace('市','');
            });*/
            /*var resultGroup = [];
            var len=areas.length
            for(var i=0;i<len;i+=4){
              resultGroup.push(areas.slice(i,i+4));
            }*/

            // console.log(provinces);
            // wx.setStorageSync('area-'+cityCode, areas)
            that.setData({
              areas:areas,
              selectedArea: areas[0] ? areas[0]['areaname'] : '',
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
  }
})
