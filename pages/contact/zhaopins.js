//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    item: {
      id: 0
    },
    list: [
      /* {
        id: 3,
        start: '合肥',
        point: '杭州',
        ishidden: true
      } */
    ],
    emptyshow: false,
    zhaopinCatsKeyVal: app.globalData.zhaopinCatsKeyVal
  },
  onLoad: function () {
    var that = this
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
      url: app.globalData.config.service.contactUrl + '/getallzhaopin',
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
          that.setData({
            list: res.data.data.list,
          })
        } else {
          util.showMaskTip1500('抱歉，数据异常，请稍后重试')
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '抱歉，数据地址请求错误.v05',
          icon: 'none',
          // icon: 'loading',
          duration: 2000
        })
        console.log('fail');
      }
    })
    
    // wx.request({ 
    // wx.hideLoading();
  },
  delZhaopin (e) {
    // 删除前步
    var that = this
    var id = e.currentTarget.dataset.id
    var cid = e.currentTarget.dataset.cid
    var index = e.currentTarget.dataset.index
    var delParams = {
      id: id,
      cid: cid,
      index: index
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          that.delAct(delParams)
        }
      }
    })
    
  },
  delAct (delParams) {
    // 删除专线操作
    var self = this
    // console.log(delParams)
    // 获取已保存信息
    wx.showLoading({
        title: '加载中..',
        mask: true
    })
    wx.request({
      url: app.globalData.config.service.contactUrl + '/delzhaopin',
      data: {
        id: delParams.id,
        cid: delParams.cid
      },
      method: 'POST',
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        sign: 'sign123123',
        ver: 'v1',
      },
      success (res) {
        // console.log(res)
        if(res.data.status != 1) {
          util.showError(res.data.message)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000,
            mask: true,
            success: function(res) {
              var nowDataList = self.data.list
              
              var changedListLen = nowDataList.length
              var emptyshow = false
              var ishiddenCount = 0;
              for(var i=0;i<changedListLen;i++) {
                if (nowDataList[i].ishidden) {
                  ishiddenCount+=1
                }
              }
              nowDataList[delParams.index].ishidden = true
              if (changedListLen == 1 || (changedListLen-ishiddenCount) == 1) {
                // changedList = []
                emptyshow = true
              }

              // 隐藏当前删除的专线
              self.setData({
                list: nowDataList,
                emptyshow: emptyshow
              })
            }
          })
        }
      },
      complete (res) {
        console.log('complete')
        console.log(res)
        wx.hideLoading()
      }
    })
  },
  updateZhaopin (e) {
    // 删除专线操作
    var self = this
    // console.log(delParams)
    // 获取已保存信息
    wx.showLoading({
        title: '加载中..',
        mask: true
    })
    var zhaopinid = e.currentTarget.dataset.id
    var cid = e.currentTarget.dataset.cid
    var cat = e.currentTarget.dataset.catid
    wx.navigateTo({
      url: '../zhaopin/add?zhaopinid='+zhaopinid+'&cid='+cid+"&catid="+cat
    })
  },
  onShareAppMessage: function (res) { // 转发
    return app.shareFun(res)
  }
})
