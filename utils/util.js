const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示提示信息
var showMaskTip1500 = text => wx.showToast({
  title: text,
  icon: 'none',
  duration: 1500,
  mask: true
})

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示成功提示
var showMaskSuccess = text => wx.showToast({
  title: text,
  icon: 'success',
  duration: 2000,
  mask: true
})

// 显示成功提示
var showError = text => wx.showToast({
  title: text,
  icon: 'none',
  duration: 3000
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
      title,
      content: JSON.stringify(content),
      showCancel: false
  })
}

// module.exports = { formatTime, showBusy, showSuccess, showModel }

module.exports = {
  formatTime, formatDay, showMaskTip1500, showBusy, showSuccess, showMaskSuccess, showError, showModel
}

/** navigateBack with an unexist webviewId */
/* function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
} */