//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

// 引入Promise
import Promise from '../../vendors/es6-promise.js';
// 用Promise封装小程序的其他API
export const promisify = (api) => {
    return (options, ...params) => {
        return new Promise((resolve, reject) => {
            api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
        });
    }
}


// 画布需要
var winWidth = 0
var winHeight = 0

wx.getSystemInfo({
  success: function(res) {
    /*console.log(res.model)
    console.log(res.pixelRatio)
    console.log(res.screenWidth)
    console.log(res.screenHeight)
    console.log(res.windowWidth)
    console.log(res.windowHeight)
    console.log(res.language)
    console.log(res.version)
    console.log(res.platform)*/
    winWidth = res.windowWidth
    winHeight = res.windowHeight
    // console.log('screenHeight::'+res.screenHeight)
  }
})

var mtop = winHeight * 0.14;

// console.log(app);
Page({
  data: {
    iscanvas: 'none',
    canIUse: false,
    canIUseWebView: wx.canIUse('web-view'),
    startProv:'',
    startCity:'',
    startVal: '',
    pointProv:'',
    pointCity:'',
    pointVal: '',
    nowCity: '定位中...',
    userInfo: {},
    imgUrls: [  {    
        link:'/pages/index/index',    
        url:'../../images/lunbo/1.jpg'     
    },{    
        link:'/pages/index/index',    
        url:'../../images/lunbo/2.jpg' 
    },{    
        link:'/pages/index/index',    
        url:'../../images/lunbo/3.jpg'   
    }],
    indicatorDots: true,    
    autoplay: true,    
    interval: 3000,    
    duration: 1000,
    indicatorColor:'#998a89',
    indicatorActiveColor:'#fff',
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
    cat: 1, // 默认省际物流
    mtop: mtop+'rpx',
    isDrawCanvas: false
  },
  onLoad: function (e) {
    console.log(e);
    /* 是否邀请进入 */
    var ooid = e.ooid
    // console.log('app.globalData::'+JSON.stringify(app.globalData));
    if (ooid) {
      // 获取邀请人 openid 并设置到 app.globalData
      app.globalData.ooid = ooid
    }
    // console.log('app.globalData::'+JSON.stringify(app.globalData));
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
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

    // 是否查询线路操作
    var getLocParam = {
      isgetZhuanxian: true
    }
    this.getNowLocation(getLocParam); // 获取当前位置
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
  },
  searchzhuanxian (e) {
    // 本业内查询专线，按照精品专线发布时间/普通专线发布时间倒序排序
    // console.log(e)
    var start = e.currentTarget.dataset.start
    var point = e.currentTarget.dataset.point
    var params = {
      start: start,
      point: point
    }
    this.getTuis(params);
  },
  getTuis: function(e) {
    var that = this;
    console.log('getTuis')
    var start = ''
    var point = ''
    if (undefined!=e) {
      if (e.start == undefined) {
        util.showMaskTip1500('请选择出发地')
        return
      } else {
        start = e.start
      }
      // console.log(e.point)
      if (undefined == e.point) {
        util.showMaskTip1500('请选择目的地')
        return
      } else {
        point = e.point
      }
    } else {
      // 默认不带条件查询
      start = that.data.startVal
      point = that.data.pointVal;
    }

    // console.log(that)
    // console.log(start)
    
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.config.service.zhuanxianUrl+'/tui',
      data: {
        'start': start,
        'point': point,
        'cat': that.data.cat
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        sign: 'sign123123',
        ver: 'v1'
      },
      success: function(res){
        wx.hideLoading();
        // console.log(res);
        console.log('succ')
        if(res.data.status !== 1) {
          wx.showToast({
            title: '抱歉，专线数据请求错误',
            icon: 'none',
            // icon: 'loading',
            duration: 2000
          })
          return
        }
        // console.log('success123')
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
        // console.log("拨打电话失败！")  
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
            if(res.data.status!=0) {
              that.setData({'nowCity':'位置获取失败'})
            } else {
              // that.setData({'nowCity':res.data.result.addressComponent.city})
              // console.log(res.data.result)
              var cityStr = res.data.result.addressComponent.city
              var provStr = res.data.result.addressComponent.province
              /*
              if (cityStr.indexOf('市')!=-1){
                cityStr = cityStr.replace('市','')
              }*/
            
              that.setData({
                nowCity:cityStr,
                // startCity:cityStr,
                startVal: provStr
              })

              // 获取当前位置后再查找专线
              if(undefined != e) {
                if (undefined != e.isgetZhuanxian) {
                  that.getTuis(); // 获取推荐专线
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
    if (setCityDirection == 'startCity') {
      this.setData({
        /*startCity: e.city,
        startProv: e.prov*/
        startVal: e.returnVal
      })
    } else {
      this.setData({
        /*pointCity: e.city,
        pointProv: e.prov*/
        pointVal: e.returnVal
      })
    }

    this.getTuis()
  },
  kuaidi100 (e) {
    util.showError('当前版本小程序暂不支持页内跳转')
    return
  },
  shopTap (e) { // TODO
    // util.showError('敬请期待')
    wx.navigateToMiniProgram({
      appId: 'wx12de72cf50e9bb0c',
      // path: 'pages/index/index?id=123',
      /* extraData: {
        foo: 'bar'
      }, */
      // envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log('test mini program')
      }
    })
  },
  newsTap (e) {
    util.showError('正在开发中，请耐心等待')
  },
  canvasShowTap (e) {
    // util.showError('正在开发中，请耐心等待')
    this.setData({
      iscanvas: 'block'
    })

    if (this.data.isDrawCanvas) {
      console.log('yesyes')
    } else {
      console.log('nonno')
    }
    this.canvasShareImg(e)
  
  },
  canvasShareImg (e) {
    var that = this

    if (winWidth == 0 || winHeight == 0) {
      util.showError('获取设备信息异常，请稍后重试');
      return
    }

    console.log('winWidth::'+winWidth)

    // var nickName = app.globalData.userInfo.nickName;
    // var avatarUrl = app.globalData.userInfo.avatarUrl;
    // if (avatarUrl) {} // TODO 判断是否获取到

    const wxGetImageInfo = promisify(wx.getImageInfo)

    Promise.all([
      wxGetImageInfo({
        src: app.globalData.config.service.hostM+'uploads/wafer/logo/logo_bg.jpg'
      }),
      wxGetImageInfo({
        src: app.globalData.config.service.hostM+'uploads/wafer/logo/chawuliu_logo.png'
      }),
      /*wxGetImageInfo({
        src: avatarUrl
      }),*/
      wxGetImageInfo({
           src: app.globalData.config.service.hostM+'uploads/wafer/logo/xcx_qrcode.jpg'
      })
    ]).then(res => {

      var canvaswidth = (winWidth / 750) * 700;
      console.log(canvaswidth)
      const ctx = wx.createCanvasContext('shareCanvas')

      // 底图
       ctx.drawImage(res[0].path, 0, 0, 350, 425)

      // 查物流 logo
      const logoImgWidth = 131 // logo width
      const qrImgSize = 120 // qrcode width
      var minusWidth = logoImgWidth - qrImgSize;

      const logoImgHeight = 120
      var yIden = 160;
      // const xIden = 40;
      // var xIden = (winWidth-(qrImgSize*2))/3 - minusWidth/2 - 8;  // 8 图片自身左边空白移除
      if (winWidth > 350) {
        canvaswidth = 350
      }
      var xIden = (canvaswidth - logoImgWidth - qrImgSize) / 3 - 2;
      console.log('xIden::'+xIden);
       ctx.drawImage(res[1].path, xIden, yIden, logoImgWidth, logoImgHeight)
       // ctx.stroke()


      // 文字
       ctx.setTextAlign('center') // 文字居中
       ctx.setFillStyle('#333333') // 文字颜色：黑色
       ctx.setFontSize(18) // 文字字号：22px
       ctx.fillText('合一物流', xIden-10+logoImgWidth/2, yIden+logoImgHeight+20)


      // 小程序码
      // var xQrImg = 190;
      var xQrImg = xIden+logoImgWidth+xIden;
      console.log('xQrImg::'+xQrImg)

      // ctx.save() // 保存当前ctx的状态
      // ctx.beginPath()
      // var xArcQr = xQrImg+60
     //  var xArcQr = xQrImg+winWidth*0.16
     //  var yArcQr = yIden+60
     // ctx.arc(xArcQr, yArcQr, 60, 0, 2*Math.PI) // 画出圆
     // ctx.clip() // 裁剪上面的圆形

      // var yQrImg = 200;
      
       ctx.drawImage(res[2].path, xQrImg, yIden, qrImgSize, qrImgSize)
       // ctx.stroke()
      // ctx.restore() // 还原状态

       // ctx.draw()

       // ctx.save() // 保存当前ctx的状态
       // var xArc = ((350 - qrImgSize) / 2)+75
       // var yArc = 300+75

       // ctx.arc(xArc, yArc, 35, 0, 2*Math.PI) // 画出圆
       // ctx.clip() // 裁剪上面的圆形

      // 个人头像
      // const avatarImgSize = 67
       // ctx.drawImage(res[2].path, ((350 - qrImgSize) / 2)+42, 300+42, avatarImgSize, avatarImgSize)
      // ctx.restore() // 还原状态
       // 
      // ctx.setStrokeStyle('#dddddd')
      // ctx.stroke()


       ctx.setTextAlign('center') // 文字居中
       ctx.setFillStyle('#333') // 文字颜色：黑色
       ctx.setFontSize(16) // 文字字号：22px
       ctx.fillText('长按识别二维码', xQrImg-3+qrImgSize/2, yIden+qrImgSize+20)
       // ctx.stroke()


       ctx.draw()

       // 设置已绘制
       that.setData({
          isDrawCanvas: true
       })

    })

    /* */
  },
  canvasSaveImg1 (e) {
    // console.log('ing1')
    this.setData({
      iscanvas: 'none'
    })
  },
  canvasSaveImg (e) {
    console.log('ing00')
    const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)

    wxCanvasToTempFilePath({
       canvasId: 'shareCanvas'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
             filePath: res.tempFilePath
      })
    }).then(res => {
       wx.showToast({
           title: '已保存到相册'
      })
       this.setData({
        iscanvas: 'none'
      })
    })
  }
})
