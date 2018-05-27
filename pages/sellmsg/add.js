//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')
var lengthtypes = ['请选择','不限车长','<4.2米','2.5米','4.2米','5米','6.2米','6.8米','7.2米','7.7米','7.8米','8.2米','8.7米','9.6米','12.5米','13米','15米','16米','17.5米']
var cartypes = ['请选择','不限车型','平板','高栏','厢式','危险','自卸','冷藏','保温','高低板','棉被车','其他']

Page({
  data: {
    item:{
      prov:'',
      city:'',
      area:'',
      startVal: '请选择',
      cid:0,
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
      catname: '',
      selltype: 1,
      shangpai: '请选择',
      cartype:'请选择',
      lengthtype:'请选择',
    },
    selltypes: '',
    defCat: 0,
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
    enddate: util.formatDay(new Date()),
    lengthtypeIndex: 0,
    cartypeIndex: 0,
    lengthtypes: lengthtypes,
    cartypes: cartypes,
    isLoaded: false
  },
  onLoad: function (e) {
    // 已加载设置
    this.setData({
      isLoaded: true
    })
    // --
    console.log('sellmsg add')
    // console.log(this.data.enddate);
    // console.log(e)
    var that = this

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: app.globalData.sellCatsKeyVal[e.catid]
    })

    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    // 判断是否已添加公司信息
    var openid = wx.getStorageSync('openid')
    if(undefined != e && undefined != e.catid && undefined == e.sellmsgid) {
      console.log('sellmsg onload')
      var selltypes = app.globalData.selltypes
      console.log(selltypes);
      // 添加专线入口
      that.setData({
        defCat: e.catid,
        selltypes: selltypes
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
            itemVal.catname = app.globalData.sellCatsKeyVal[that.data.defCat]
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

      // 加载当前位置
      this.getNowLocation();
      return
    } else if (undefined != e && undefined != e.sellmsgid) {
      console.log('upupdate')
      // 修改入口
      wx.request({
        url: app.globalData.config.service.sellmsgUrl+'/toupdate',
        data: {
          id: e.sellmsgid,
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
            itemVal.area = res.data.data.area;
            if (res.data.data.area != '') {
              itemVal.quyu = res.data.data.area;
            } else if (res.data.data.city != '') {
              itemVal.quyu = res.data.data.city;
            } else if (res.data.data.prov != '') {
              itemVal.quyu = res.data.data.prov;
            }
            itemVal.quyu = itemVal.quyu ? itemVal.quyu : '请选择';
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
            itemVal.catname = app.globalData.sellCatsKeyVal[_cat]
            itemVal.selltype = res.data.data.selltype;
            itemVal.pinpai = res.data.data.pinpai;
            itemVal.price = res.data.data.price;
            itemVal.shangpai = res.data.data.shangpai ? res.data.data.shangpai : '请选择';
            itemVal.licheng = res.data.data.licheng;
            itemVal.lengthtype = res.data.data.lengthtype ? res.data.data.lengthtype : '请选择';
            itemVal.cartype = res.data.data.cartype ? res.data.data.cartype : '请选择';
            
            // 图片展示
            var showImgs = that.data.showImgs
            showImgs['img1'] = res.data.data.domainimg1
            showImgs['img2'] = res.data.data.domainimg2
            showImgs['img3'] = res.data.data.domainimg3
            showImgs['img4'] = res.data.data.domainimg4


            // 招聘分类无“发布类型”
            // radio 单选控制
            var selltypes = JSON.parse(JSON.stringify(app.globalData.selltypes))

            for(var i=0;i<selltypes.length;i++) {
              if (i == itemVal.selltype) {
                selltypes[i].checked = true
              } else {
                selltypes[i].checked = false
              }
            }
            that.setData({
              item:itemVal,
              selltypes: selltypes,
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
  onShow: function(e) {
    // 每次打开小程序时候，获取当前位置
    console.log('onshow');

    // 控制非后台打开不刷新
    /*var showIden3 = wx.getStorageSync('showIden3');
    var showIden3Global = app.globalData.showIden3;
    if (showIden3 == showIden3Global) {
      return;
    } else {
      wx.setStorage({
        key: 'showIden3',
        data: showIden3Global
      });
    }*/

    /*if (this.data.isLoaded) {
      this.getNowLocation(); // 放在 onShow 的目的是当小程序启动，或从后台进入前台显示都获取当前位置
    }*/
    console.log('onshow end')
  },
  formSubmit:function(e){
    wx.showLoading({
      title: '正在提交...',
      mask:true
    })

    var that=this
    // 提交校验
    var formdata = e.detail.value
    if (formdata.quyu=='') {
      util.showMaskTip1500('请选择发布城市或地区')
      return
    }
    if (that.data.item.catname == '出售') {
      // 非购买，判断车辆相关信息是否为空 品牌/价格/上牌时间/里程数
      if (formdata.pinpai == '') {
        util.showMaskTip1500('品牌不能为空')
        return
      } else if (formdata.cartype == '请选择') {
        util.showMaskTip1500('车型不能为空')
        return
      } else if (formdata.lengthtype == '请选择') {
        util.showMaskTip1500('车长不能为空')
        return
      } else if (formdata.price == '') {
        util.showMaskTip1500('价格不能为空')
        return
      } else if (formdata.shangpai == '请选择') {
        util.showMaskTip1500('上牌时间不能为空')
        return
      } else if (formdata.licheng == '') {
        util.showMaskTip1500('里程数不能为空')
        return
      }
    }
    if (formdata.nickname == '') {
      util.showMaskTip1500('联系人不能为空')
    } else if (formdata.phone == '') {
      util.showMaskTip1500('手机号码不能为空')
    } else if (formdata.address == '') {
      util.showMaskTip1500('地址不能为空')
    } else if (formdata.cid == '') {
      util.showMaskTip1500('抱歉，联系人信息异常，请重新加载后重试')
    } else if(formdata.content==''){
          util.showMaskTip1500('内容不能为空')
        // } else if (formdata.img1 == '' && formdata.img2 == '' && formdata.img3 == '' && formdata.img4 == '') {
          // util.showMaskTip1500('抱歉，请至少上传一张图片')
          return   
    } else {
      //提交
      var reqUrl = app.globalData.config.service.sellmsgUrl+'/add';
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
                    wx.redirectTo({url: '../contact/sellmsgs'})
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
  },/*
  sellTypeChange (e) {
    // console.log(e)
    var checkVal = e.detail.value
    console.log(checkVal)
    this.setData({
      "item.selltype": Number(checkVal)
    })
  },*/
  bindCartypeChange (e) {
    this.setData({
      cartypeIndex: e.detail.value,
      "item.cartype": cartypes[e.detail.value]
    })
  },
  bindLenghtypeChange (e) {
    this.setData({
      lengthtypeIndex: e.detail.value,
      "item.lengthtype": lengthtypes[e.detail.value]
    })
  },
  bindPinpaiBlur (e) {
    this.setData({
      "item.pinpai": e.detail.value
    })
  },
  bindPriceBlur (e) {
    this.setData({
      "item.price": e.detail.value
    })
  },
  bindShangpaiBlur (e) {
    this.setData({
      "item.shangpai": e.detail.value
    })
  },
  bindLichengBlur (e) {
    this.setData({
      "item.licheng": e.detail.value
    })
  },
  bindWordChg (e) {
    this.setData({
      "item.content": e.detail.value
    })
  },
  toSelectQuyu (e) {
    // 求职区域
    // var areaCat = app.globalData.zxCatShinei;
    // var nowAreaVal = this.data.item.city
    // var nowAreaCatStr = 'city'
    // 选择
    wx.navigateTo({
      url:"../city2/index?direction=item.quyu"
    })
  },
  changeCity (e) {
    console.log('changeCity')
    // 选中的城市值赋值
    console.log(e)
    var setCityDirection = e.direction
    if (setCityDirection == 'item.quyu') {
      var cityVal = util.getZhuanxianShow(e);
      this.setData({
        'item.prov': e.selectedProv,
        'item.city': e.selectedCity,
        'item.area': e.selectedArea,
        'item.quyu': cityVal
      })
    }
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
          'from': 'sellmsg'
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
          url: app.globalData.config.service.baiduApi+'&location=' + latitude + ',' + longitude + '&output=json&coordtype=wgs84ll', 
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
              if (provStr.indexOf('市')!=-1){
                provStr = provStr.replace('市','')
              }
              var cityStr = locationInfo.city

              if (cityStr.indexOf('市')!=-1){
                cityStr = cityStr.replace('市','')
              }
              var cityStrShow = cityStr
              if (provStr == cityStr) {
                cityStr = '辖区';
              }
              that.setData({
                "item.prov":provStr,
                "item.city":cityStr,
                "item.quyu":cityStrShow
              })
            }
          }
        })
      }
    })
  },
  bindDateChange (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'item.shangpai': e.detail.value
    })
  }
})
