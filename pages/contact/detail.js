//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    item:{
      id:0,
      image: "../../images/testimg/1.jpg",
      title: "大江物流",
      message:["合肥-上海","合肥-无锡"],
      phone:"13912341234"
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
  ylImg:function(e) {
    console.log(e.currentTarget.dataset.src);
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
  }
})
