//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util")
// var lastnavtapCat = {} // 最后选择的值
Page({
  data: {
    start_prov:'',
    start_city:'',
    start_area:'',
    startVal: '',
    point_prov:'',
    point_city:'',
    point_area:'',
    pointVal: '请选择',
    nowCity: '定位中...',
    nowProv: '省份',
    nowDistrict: '区县',
    nowAreaVal: '',
    nowAreaCatStr: '',
    isTaped: false,
    list: [
      /* {
        id:0,
        image: "../../images/testimg/1.jpg",
        company: "大江物流",
        phone: '13966780466',
        address: '合肥购物广场物流园1234',
        start:'合肥',
        point:'杭州'
      }, */
    ],
    zxCats:app.globalData.zxCats,
    cat:1,
    isLoaded: false,
    isCityReturn: false // 是否选择城市后返回
    // lastnavtapCat: {}
  },
  onLoad: function (e) {
    console.log('onload')
    console.log(e);
    // 已加载设置
    this.setData({
      isLoaded: true
    })
    // --
    console.log('onload end')
    if (undefined == e.cat) {
      e.cat = this.data.cat;
    }
    // 设置当前选中分类
    this.setData({
      cat: e.cat
    })
  },
  onShow: function(e) {
    // 每次打开小程序时候，获取当前位置
    console.log('onshow');
    console.log(e)

    // 控制非后台打开不刷新
    /*var showIden2 = wx.getStorageSync('showIden2');
    var showIden2Global = app.globalData.showIden2;
    if (showIden2 == showIden2Global) {
      return;
    } else {
      wx.setStorage({
        key: 'showIden2',
        data: showIden2Global
      });
    }*/

    /*wx.showModal({
      title: 'onshow',
      content: 'isciti2return::'+this.data.isCityReturn
    })*/
    
    if (this.data.isLoaded && !this.data.isCityReturn) {
      // wx.showModal({
      //   title: 'app . tip',
      //   content: 'content:'+JSON.stringify(e)
      // })
      var cat = this.data.cat
      // 是否查询线路操作
      var getLocParam = {
        isgetZhuanxian: true,
        cat: cat
      }
      this.getNowLocation(getLocParam); // 放在 onShow 的目的是当小程序启动，或从后台进入前台显示都获取当前位置并实时查询
    }
    console.log('onshow end')
  },
  onHide (e) {
    this.setData({
      isCityReturn: false
    })
    /*wx.showModal({
      title: 'hide tit',
      content: 'on hide::' + JSON.stringify(this.data.isCityReturn)
    })*/
  },
  bindNavTaped:function(e) {
    if (undefined != e.cat) {
      var catid = e.cat
    } else {
      var catid = e.currentTarget.dataset.cat
    }

    // var startVal = '';
    // var pointVal = '';
    // console.log('lastnavtapCat::'+JSON.stringify(this.data.lastnavtapCat))
    // var lastnavtapCatData = this.data.lastnavtapCat
    // // 1、之前有选择值，不自动变化
    // // 2、比较当前值是否不同，不同则更改
    // var proStart = 'start';

    // if (lastnavtapCatData[catid] != undefined && (proStart in lastnavtapCatData[catid])) {
    //   startVal = lastnavtapCatData[catid].start
    // }

    // console.log('last cat - '+catid+' startVal:'+startVal)
    // if (lastnavtapCatData[catid] != undefined && ('point' in lastnavtapCatData[catid])) {
    //   pointVal = lastnavtapCatData[catid].point
    // }
    // console.log('last cat - '+catid+' pointVal:'+pointVal)

    // 专线区域类别切换
    var catid = parseInt(catid)  
    this.setData({  
      cat: catid
    })
    var startValSet = '';
    var pointValSet = '';

    if (catid == app.globalData.zxCatShinei) {
      console.log('shinei::::'+this.data.nowDistrict)
      this.setData({
        startVal: this.data.nowDistrict,
      })
    }


    /*if (catid == app.globalData.zxCatShengji || catid == app.globalData.zxCatKongyun || catid == app.globalData.zxCatHaiyun || catid == app.globalData.zxCatPeizai) {
      this.setData({
        startVal: this.data.nowProv,
        nowAreaVal: this.data.nowProv,
        nowAreaCatStr: '',
        pointVal: '请选择'
      })
      startValSet = this.data.nowProv;
      pointValSet = '请选择'
    } else if (catid == app.globalData.zxCatShengnei) {
      // console.log('catidcatidcatid::'+catid);
      this.setData({
        startVal: this.data.nowCity,
        nowAreaVal: this.data.nowProv,
        nowAreaCatStr: 'province',
        pointVal: '请选择'
      })
      startValSet = this.data.nowCity;
      pointValSet = '请选择'
    } else if (catid == app.globalData.zxCatShinei) {
      this.setData({
        startVal: this.data.nowDistrict,
        nowAreaVal: this.data.nowCity,
        nowAreaCatStr: 'city',
        pointVal: '请选择'
      })
      startValSet = this.data.nowDistrict;
      pointValSet = '请选择'
    } else {
      this.setData({
        startVal: this.data.nowCity,
        nowAreaVal: this.data.nowCity,
        nowAreaCatStr: 'city',
        pointVal: '请选择'
      })
      startValSet = this.data.nowCity;
      pointValSet = '请选择'
    }*/
    // console.log(this.data)
    this.getSearches(); // 获取推荐专线
    

    // 保存设置的值
    // var firstParam = {
    //   start: this.data.startVal,
    //   point: this.data.pointVal
    // }
    // this.setFirstSelectVal(firstParam);
  },
  setFirstSelectVal(firstParam) {
    // 最后一次选择的地区赋值
    var lastnavtapCatData = this.data.lastnavtapCat
    var catid = this.data.cat
    var catDirectinObj = lastnavtapCatData[catid] == undefined ? {} : lastnavtapCatData[catid];
    // console.log('lastnavtapCatData::'+JSON.stringify(lastnavtapCatData))
    if (undefined != firstParam.start) {
      catDirectinObj.start = firstParam.start
    }
    if (undefined != firstParam.point) {
      catDirectinObj.point = firstParam.point
    }
    lastnavtapCatData[catid] = catDirectinObj
    this.setData({
        lastnavtapCat: lastnavtapCatData
    })
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  searchzhuanxian (e) {
    // 本业内查询专线，按照精品专线发布时间/普通专线发布时间倒序排序
    // console.log(e)
    /*var start = e.currentTarget.dataset.start
    var point = e.currentTarget.dataset.point
    var cat = e.currentTarget.dataset.catid
    var params = {
      start: start,
      point: point,
      catid: cat
    }*/
    this.getSearches();
  },
  getSearches: function(e) {
    var that = this;
    /*var start = ''
    var point = ''
    var catid = 0
    // console.log(e)
    if (undefined!=e) {
      if (e.start == undefined) {
        util.showMaskTip1500('请选择出发地')
        return
      } else {
        start = e.start
      }
      // console.log('e.point::'+e.point)
      if (undefined == e.point) {
        util.showMaskTip1500('请选择目的地')
        return
      } else {
        point = e.point
      }

      if(undefined != e.catid) {
        catid = e.catid
      }
    } else {
      // 默认不带条件查询
      start = that.data.startVal
      point = that.data.pointVal
      catid = that.data.cat
    }*/

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.zhuanxianUrl+'/search',
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        start_prov: that.data.start_prov,
        start_city: that.data.start_city,
        start_area: that.data.start_area,
        point_prov: that.data.point_prov,
        point_city: that.data.point_city,
        point_area: that.data.point_area,
        cat: that.data.cat
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        console.log('res.data.status:'+res.data.status);
        if(res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，专线数据请求错误',
            icon: 'none',
            // icon: 'loading',
            duration: 2000
          })
          return
        }
        // console.log(res)
        that.setData({list:res.data.data.list})
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
        console.log('complete');
        // console.log(res)
      }
    })
    // console.log();
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
            if(res.data.status!=0) {
              that.setData({'nowCity':'位置获取失败'})
            } else {
              console.log('locatin::::----')
              console.log(res.data.result.addressComponent);
              var provStr = res.data.result.addressComponent.province
              // provStr = '安徽省'
              var cityStr = res.data.result.addressComponent.city
              // cityStr = '合肥市'
              var districtStr = res.data.result.addressComponent.district
              // districtStr = '蜀山区'
              // 
              that.setData({
                nowCity:cityStr,
                nowProv:provStr,
                nowDistrict:districtStr,
                startVal: provStr,
                start_prov: provStr,
                start_city: cityStr,
                start_area: districtStr
              })

              if (provStr == cityStr) {
                // 直辖市的名称作为省份、区作为市
                that.setData({
                  start_city: districtStr,
                  start_area: ''
                })
              }

              // 获取当前位置后再查找专线
              if(undefined != e) {
                if (undefined != e.isgetZhuanxian) {
                  var eParam = {
                    cat: e.cat
                  }
                  that.bindNavTaped(eParam)
                  // that.getSearches(); // 获取推荐专线
                }
              }
            }
          }
        })
      }
    })
  },
  changeCity (e) {
    console.log('changeCity')
    // 选中的城市值赋值
    console.log(e)

    var setCityDirection = e.direction
    var cityVal = util.getZhuanxianShow(e);
    if (setCityDirection == 'startCity') {
      this.setData({
        start_prov: e.selectedProv,
        start_city: e.selectedCity,
        start_area: e.selectedArea,
        startVal: cityVal
      })
    } else {
      this.setData({
        point_prov: e.selectedProv,
        point_city: e.selectedCity,
        point_area: e.selectedArea,
        pointVal: cityVal
      })
    }

    this.setData({
      isCityReturn: true
    })

    this.getSearches();
  }
})