//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item: {
      id: 0
    },
    companyimg:{
      img1:'',
      img2:'',
      img3:'',
      img4:'',
    },
    defaultimg: '../../images/company/default.jpg',
    imglist:{},
    form_type: 'submit',
    disabled: false,
    plain: false,
    loading: false,
    defaultsize: 'default'
  },
  onLoad: function () {
    var that = this

    // 检查微信信息是否已获取，如果没获取，则重新获取并赋值至 app.globalData
    that.getUserInfoThis()

    // 获取已保存信息
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    // 获取公司信息
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
      return;
    }
    wx.request({
      url: app.globalData.config.service.contactUrl+'/companyinfo',
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
        if(res.data.status == 1) {
          var companyimgs = {
            'img1':res.data.data.domainimg1,
            'img2':res.data.data.domainimg2,
            'img3':res.data.data.domainimg3,
            'img4':res.data.data.domainimg4,
          }
          var imglists = {
            'img1':res.data.data.img1,
            'img2':res.data.data.img2,
            'img3':res.data.data.img3,
            'img4':res.data.data.img4,
          }
          
          that.setData({
            item: res.data.data,
            companyimg: companyimgs,
            imglist: imglists
          })
        } else {
          wx.showToast({
            title: '请务必填写真实信息，方便其他的用户根据您的专线/物流等信息与您联系',
            icon: 'none',
            duration: 3500
          })
        }
        // console.log(that.data);
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v02',
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
    
    // wx.request({ 
    // wx.hideLoading();
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  //点击选择图片
  checkImg:function(imgId){
    // console.log(imgId);
    // console.log('点击选择图片');
    self=this
    // console.log(self);
    
    wx.chooseImage({
    count: 1, // 默认9
    // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths

      // console.log(res)

      // 上传到服务器
      wx.uploadFile({
        url: app.globalData.config.service.uploadUrl, //仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData:{
          'from': 'company'
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
            var companyImgs = self.data.companyimg;
            var imglist = self.data.imglist;

            var imgUploadUrl = jsonData.data.imgurl
            imglist[imgId] = imgUploadUrl;
            // console.log(imglist)

            // 设置本地展示
            companyImgs[imgId] = tempFilePaths[0];
            self.setData({
              imglist:imglist,
              companyimg:companyImgs
            })
          }
        },
        fail: function() {
          util.showError('上传失败')
        }
      })

    }
    })
  },
  //点击预览图片
  ylImg:function(e){
    // wx.showLoading({
    //   title: '加载中..',
    //   mask: true
    // })
    
    // console.log(e);
    // var nowImg = e.currentTarget.dataset.src;
    // if (nowImg == '../../images/company/default.jpg') {
      this.checkImg(e.currentTarget.id);
    // } else {
      /*
      wx.previewImage({
        current: e.currentTarget.dataset.src,
        urls: [e.currentTarget.dataset.src], // 需要预览的图片http链接列表
        fail:function(e){
            // console.log(e);
            wx.showToast({
              title: '预览失败',
              icon: 'none',
              duration: 2000
            })
          }
      })
    }*/
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
    if(formdata.company==''){
      util.showMaskTip1500('公司名称不能为空')
    } else if (formdata.nickname == '') {
      util.showMaskTip1500('联系人不能为空')
    } else if (formdata.phone == '') {
      util.showMaskTip1500('手机号码不能为空')
    } else if (formdata.address == '') {
      util.showMaskTip1500('公司地址不能为空')
    } else if (formdata.img4 == '' && formdata.img1 == '' && formdata.img2 == '' && formdata.img3 == '') { // 图片地址至少一张
      util.showMaskTip1500('请至少选择一张图片')
    } else {
      var openid = wx.getStorageSync('openid');
      if (!openid) {
        util.showMaskTip1500('数据获取失败，请重新打开小程序，并允许获取用户信息')
        return;
      } else {
        formdata.openid = openid
      }

      var userInfo = app.globalData.userInfo
      // console.log(userInfo)
      if (!userInfo) {
        // 检查微信信息是否已获取，如果没获取，则重新获取并赋值至 app.globalData
        that.getUserInfoThis()

        // 提示
        util.showMaskTip1500('微信数据获取异常，请稍等2秒后重试')
        return
      } else {
        formdata.avatarUrl = userInfo.avatarUrl
        formdata.wxnickname = userInfo.nickName
      }
      // Object.assign(formdata, userInfo) // 合并对象
      // return

      //提交
      var reqUrl = app.globalData.config.service.contactUrl;
      if (formdata.id == 0) {
        formdata.fromooid = app.globalData.ooid
        reqUrl = reqUrl + '/addcompany'
      } else {
        reqUrl = reqUrl + '/updatecompany'
      }
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
            // try {
              util.showError(res.data.message)
            /* } catch(e) {
              console.log(e)
            } */
          } else {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function(res) {
                // console.log(res)
                setTimeout(
                  function() {
                    wx.switchTab({
                      url: '/pages/contact/index'
                    })
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
  getUserInfoThis:function(e) { // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
      console.log('thisdata----')
      console.log(app.globalData.userInfo)
      console.log('thisdata----')
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  }
})
