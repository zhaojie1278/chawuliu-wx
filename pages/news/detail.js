//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

Page({
  data: {
    item:{
      id:0,
      titleimg: '../../images/testimg/1.jpg',
      title: '新闻123新闻123',
      update_time: '2018-4-18',
      content: '新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容新闻内容',
      domainimg1: '../../images/testimg/1.jpg',
      domainimg2: '../../images/testimg/1.jpg',
      domainimg3: '../../images/testimg/2.jpg',
      domainimg4: '../../images/testimg/1.jpg'
    }
  },
  onLoad: function ($query) {
    // console.log(this.data);
    // 加载中
    wx.showLoading({
        title: '加载中..',
        mask: true
    })

    var that = this;
    var nid = $query.id
    console.log(nid);
/*    wx.request({
      url: app.globalData.config.service.contactUrl,
      data: {
        id: nid
      },
      method: 'POST',
      dataType: 'json',
      header: {
        sign: 'sign123123',
        ver: 'v1',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if (res.data.status !== 1) {       
          wx.showToast({
            title: '抱歉，请求失败，' + res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            item: res.data.data
          })
        }
        // console.log(res);
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v04',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        console.log('fail');
        // coonsole.log(res);
      }
    })*/
    wx.hideLoading();
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  },
  ylImg:function(e) {
    // console.log(e.currentTarget.dataset.src);
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
