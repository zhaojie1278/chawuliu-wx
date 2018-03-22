//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    companyimg:{
      img0:'../../images/company/default.jpg',
      img1:'../../images/company/default.jpg',
      img2:'../../images/company/default.jpg',
      img3:'../../images/company/default.jpg'
    },
    imglist:[]
  },
  onLoad: function () {
    // 获取已保存信息
    wx.showLoading({
        title: '加载中..',
        mask: true
    })
    

    // wx.request({ 
      wx.hideLoading();
  },
  //点击选择图片
  checkImg:function(imgId){
    // console.log(imgId);
    // console.log('点击选择图片');
    self=this
    var companyImgs = self.data.companyimg;
    // console.log( companyImgs);
    
    wx.chooseImage({
    count: 1, // 默认9
    // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths
      companyImgs[imgId] = tempFilePaths[0];
      self.setData({
        imglist:companyImgs,
        companyimg:companyImgs
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
    self=this
    //图片
    var imglist = self.data.imglist
    //提问内容
    var content=e.detail.value.content;
    if(content==''){
     wx.showToast({
      title: '内容不能为空',
      icon: 'loading',
      duration: 1000,
      mask:true
     })
    }
    wx.showLoading({
     title: '正在提交...',
     mask:true
    })
    //添加问题
    wx.request({
     url: 'https://xxxxxxxxxx/index.PHP?g=user&m=center&a=createwt',
     data: {
      content:content
     },
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: app.globalData.header, // 设置请求的 header
     success: function (res) {
      // success
      if(typeof(res.data)=='number'){
       if (imglist != '') {
        //开始插入图片
        for(var i=0;i<imglist.length;i++){
         //上传至服务器
         wx.uploadFile({
          url: 'https://xxxxxxxx/index.php?g=user&m=center&a=upload', //仅为示例，非真实的接口地址
          filePath: imglist[0],
          name: 'files',
          formData: {
           'wtid': res.data
          },
          header: app.globalData.header,
          success: function (res) {
           if(i>=imglist.length){
            self.setData({
             imglist:[]
            })
            wx.hideLoading();
            wx.showToast({
             title: '提问成功',
             icon: 'success',
             duration: 2000,
             mask: true
            })
            wx.navigateBack({
             delta: 1
            })
           }
          }
         })
        }
        console.log(imglist);
       }else{
        wx.hideLoading();
        wx.showToast({
         title: '提问成功',
         icon: 'success',
         duration: 2000,
         mask: true
        })
        wx.navigateBack({
         delta: 1
        })
       }
      }else{
       wx.hideLoading();
       wx.showToast({
        title: res.data,
        icon: 'loading',
        duration: 1000,
        mask: true
       })
      }
     },
     fail: function (res) {
      self.onLoad();
     }
    })
  }
})
