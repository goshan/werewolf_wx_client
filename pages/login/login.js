//index.js
//获取应用实例
const url = require('../../utils/url.js')
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
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      // update user info in server
      wx.request({
        method: "post",
        url: url.request()+"/login",
        data: {
          code: wx.getStorageSync('login_res_code'),
          name: userInfo.nickName,
          image: userInfo.avatarUrl
        },
        success: res => {
          console.log(res.data)
          if (res.data.token) {
            wx.setStorageSync('token', {
              token: res.data.token,
              permission: res.data.permission
            })
          }
          else {
            wx.showToast({
              title: "服务器通信失败"
            })
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
