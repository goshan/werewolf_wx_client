//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.showLoading({
      title: '获取中',
      mask: true,
    })
    if (app.globalData.userInfo) {
      this.setUserInfo(app.globalData.userInfo, false)
    }
    else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                this.setUserInfo(res.userInfo)
              }
            })
          }
          else if (!this.data.canIUse) {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
              success: res => {
                this.setUserInfo(res.userInfo)
              }
            })
          }
          else {
            // wait for clicking auth button
            wx.hideLoading()
          }
        },
      })
    }
  },
  getUserInfoFallback: function(res) {
    wx.showLoading({
      title: '获取中',
      mask: true,
    })
    this.setUserInfo(res.detail.userInfo)
  },
  login: function() {
    wx.navigateTo({
      url: '../game/game'
    })
  },
  setUserInfo: function(userInfo, with_global=true) {
    if (!userInfo) {
      return
    }

    if (with_global) {
      app.globalData.userInfo = userInfo
      // update user info in server
      wx.request({
        method: "post",
        url: app.config.requestProtocol+"://"+app.config.host+"/wx/info",
        data: {
          openid: wx.getStorageSync('session').openid,
          name: userInfo.nickName
        },
        success: res => {
          if (res.msg == "OK") {

          }
        }
      })
    }
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
    wx.hideLoading()
  }
})
