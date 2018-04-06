//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')
// var areaCats = new Array('省际物流','省内物流','空运','海运','配载调车')

// 车辆买卖发布类型
var selltypes = [
  {name: '0', value: '出售', checked: 'true'},
  {name: '1', value: '购买'},
]

Page({
  data: {
    userInfo: {},
    item:{
      prov:'',
      city:'',
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
      selltype: 1
    },
    selltypes: selltypes,
    isnotzhaopin: true,
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
    }
  },
  onLoad: function (e) {

    console.log('sellmsg add')
    // console.log(e)
    var that = this

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: app.globalData.sellCatsSecondKeyVal[e.catid-1]
    })

    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    // 位置信息
    that.getNowLocation();

    // 判断是否招聘
    if (e.catid in app.globalData.zhaopinCatsSecondObj) {
      that.setData({
        isnotzhaopin: false
      })
    }
    // 判断是否已添加公司信息
    var openid = wx.getStorageSync('openid')
    if(undefined != e && undefined != e.catid && undefined == e.sellmsgid) {
      console.log('addddd')
      // 添加专线入口
      that.setData({
        defCat: e.catid-1,
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
            itemVal.catname = app.globalData.sellCatsSecondKeyVal[that.data.defCat]
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
    } else if (undefined != e && undefined != e.sellmsgid) {
      console.log('upupdate')
      // 修改专线入口
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
            var _cat = res.data.data.cat-1 // 本地数组索引小于1
            itemVal.catname = app.globalData.sellCatsSecondKeyVal[_cat]
            itemVal.selltype = res.data.data.selltype;
            
            // 图片展示
            var showImgs = that.data.showImgs
            showImgs['img1'] = res.data.data.domainimg1
            showImgs['img2'] = res.data.data.domainimg2
            showImgs['img3'] = res.data.data.domainimg3
            showImgs['img4'] = res.data.data.domainimg4


            // 招聘分类无“发布类型”
            if (e.catid in app.globalData.zhaopinCatsSecondObj) {
              that.setData({
                isnotzhaopin: false
              })
              that.setData({
                item:itemVal,
                showImgs: showImgs
              })
            } else {
              // radio 单选控制
              for(var i=0;i<selltypes.length;i++) {
                if (i == itemVal.selltype-1) {
                  selltypes[i].checked = true
                } else {
                  selltypes[i].checked = false
                }
              }
              // selltypes[itemVal.selltype-1].checked = true
              that.setData({
                item:itemVal,
                selltypes: selltypes,
                showImgs: showImgs
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

    var that=this
    // 提交校验
    var formdata = e.detail.value
    if(formdata.content==''){
      util.showMaskTip1500('内容不能为空')
    // } else if (formdata.img1 == '' && formdata.img2 == '' && formdata.img3 == '' && formdata.img4 == '') {
      // util.showMaskTip1500('抱歉，请至少上传一张图片')        
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
            util.showError(res.data.message)
          } else {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function(res) {
                setTimeout(
                  function() {
                    wx.navigateTo({url: '../contact/sellmsgs'})
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
  sellTypeChange (e) {
    // console.log(e)
    var checkVal = e.detail.value
    console.log(checkVal)
    this.setData({
      "item.selltype": Number(checkVal)+1
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
