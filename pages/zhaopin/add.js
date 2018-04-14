//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')
var jiazhaoCats = ['请选择','A1','A2','A3','B1','B2','C1','C2']
var jialingCats = ['请选择','无','1-2年','3-4年','4-5年','5年以上']
var gongziCats = ['请选择','面议','1000-3000元','3000-5000元','5000-8000元','8000以上']
Page({
  data: {
    userInfo: {},
    item:{
      prov:'',
      city:'',
      cid:0,
      jiazhao:'请选择',
      jialing:'请选择',
      gongzi:'请选择',
      fuli:'',
      content:'',
      img1:'',
      img2:'',
      img3:'',
      img4:'',
      marks:'',
      status:'',
      nickname:'',
      phone:'',
      address:'',
      cat: 0,
      catname: ''
    },
    defCat: 1,
    form_type: 'submit',
    disabled: false,
    plain: false,
    loading: false,
    defaultsize: 'default',
    defaultimg: '../../images/company/default.jpg',
    showImgs: {
      img1: '',
      img2: '',
      img3: '',
      img4: ''
    },
    jiazhaoIndex: 0,
    jialingIndex: 0,
    gongziIndex: 0,
    jiazhaoCats: jiazhaoCats,
    jialingCats: jialingCats,
    gongziCats: gongziCats
  },
  onLoad: function (e) {

    console.log('zhaopin add')
    // console.log(e)
    var that = this

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: app.globalData.zhaopinCatsKeyVal[e.catid]
    })

    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    // 位置信息
    that.getNowLocation();

    // 判断是否已添加公司信息
    var openid = wx.getStorageSync('openid')
    if(undefined != e && undefined != e.catid && undefined == e.zhaopinid) {
      console.log('zhaopin addddd')
      // 添加专线入口
      that.setData({
        defCat: e.catid,
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
            itemVal.catname = app.globalData.zhaopinCatsKeyVal[that.data.defCat]
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

      return
    } else if (undefined != e && undefined != e.zhaopinid) {
      console.log('upupdate')
      // 修改专线入口
      wx.request({
        url: app.globalData.config.service.zhaopinUrl+'/toupdate',
        data: {
          id: e.zhaopinid,
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
            itemVal.prov = res.data.data.prov;
            itemVal.city = res.data.data.city;
            itemVal.cid = res.data.data.cid;
            itemVal.content = res.data.data.content;
            itemVal.img1 = res.data.data.img1;
            itemVal.img2 = res.data.data.img2;
            itemVal.img3 = res.data.data.img3;
            itemVal.img4 = res.data.data.img4;
            itemVal.marks = res.data.data.marks;
            itemVal.status = res.data.data.status;
            itemVal.nickname = res.data.data.nickname;
            itemVal.phone = res.data.data.phone;
            itemVal.address = res.data.data.address;
            itemVal.cat = res.data.data.cat;
            var _cat = res.data.data.cat // 本地数组索引小于1
            itemVal.catname = app.globalData.zhaopinCatsKeyVal[_cat]
            itemVal.jiazhao = res.data.data.jiazhao;
            itemVal.jialing = res.data.data.jialing;
            itemVal.gongzi = res.data.data.gongzi;
            itemVal.fuli = res.data.data.fuli;
            
            // 图片展示
            var showImgs = that.data.showImgs
            showImgs['img1'] = res.data.data.domainimg1
            showImgs['img2'] = res.data.data.domainimg2
            showImgs['img3'] = res.data.data.domainimg3
            showImgs['img4'] = res.data.data.domainimg4

            that.setData({
              item:itemVal,
              showImgs: showImgs
            })
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

    var that=this
    // 提交校验
    var formdata = e.detail.value
    if(formdata.jiazhao=='请选择'){
      util.showMaskTip1500('请选择驾照类型')
    } else if(formdata.jialing=='请选择'){
      util.showMaskTip1500('请选择驾龄')
    } else if(formdata.gongzi=='请选择'){
      util.showMaskTip1500('请选择工资')
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
      var reqUrl = app.globalData.config.service.zhaopinUrl+'/add';
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
            util.showError('发布失败')
          } else {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function(res) {
                setTimeout(
                  function() {
                    wx.navigateTo({url: '../contact/zhaopins'})
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
  bindJiazhaoChange (e) {
    this.setData({
      jiazhaoIndex: e.detail.value,
      "item.jiazhao": jiazhaoCats[e.detail.value]
    })
  },
  bindJialingChange (e) {
    this.setData({
      jialingIndex: e.detail.value,
      "item.jialing": jialingCats[e.detail.value]
    })
  },
  bindGoongziChange (e) {
    this.setData({
      gongziIndex: e.detail.value,
      "item.gongzi": gongziCats[e.detail.value]
    })
  },
  bindFuliBlur (e) {
    this.setData({
      "item.fuli": e.detail.value
    })
  },
  bindWordChg (e) {
    this.setData({
      "item.content": e.detail.value
    })
  },
  checkImg:function(e){
    var imgId = e.currentTarget.id
    //点击选择图片
    var that=this
    console.log(that);
    
    wx.chooseImage({
    count: 1,
    success: function (res) {
      var tempFilePaths = res.tempFilePaths

      console.log(res)

      // 上传到服务器
      wx.uploadFile({
        url: app.globalData.config.service.uploadUrl, //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData:{
          'from': 'zhaopin'
        },
        success: function(res){
          console.log('upload res::')
          // console.log(res)
          var data = res.data
          // console.log(res);
          var jsonData = JSON.parse(data)
          // console.log(jsonData);
          // console.log(jsonData.status);

          if (jsonData.status != 1) {
            util.showError(jsonData.message)
          } else {
            var showImgs = that.data.showImgs;
            var item = that.data.item;

            var imgUploadUrl = jsonData.data.imgurl
            item[imgId] = imgUploadUrl;

            // 设置本地展示
            showImgs[imgId] = tempFilePaths[0];
            that.setData({
              item:item,
              showImgs:showImgs
            })
            console.log(that.data)
          }
        },
        fail: function() {
          util.showError('上传失败')
        }
      })
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
          url: 'https://api.map.baidu.com/geocoder/v2/?ak='+app.globalData.baiduAk+'&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll', 
          data: { },
          header: { 'Content-Type': 'application/json' },
          success: function(res) {
            // console.log(res)
            // console.log(typeof(res.data.status));
            // console.log(res.data.result.addressComponent.city);
            if(res.data.status==0) {
              var locationInfo = res.data.result.addressComponent
              // console.log(locationInfo)
              var provStr = locationInfo.province
              var cityStr = locationInfo.city
              that.setData({
                "item.prov":provStr,
                "item.city":cityStr
              })
            }
          }
        })
      }
    })
  }
})
