//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    item:{
      start:'',
      point:'',
      zhong:'',
      paohu:'',
      nickname:'张先生',
      phone:'13966666666',
      address:'安徽省合肥市繁华大道机关小区'
    }
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
