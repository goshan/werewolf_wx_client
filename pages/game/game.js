//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    opend: wx.getStorageSync('session').openid,
    players: []
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    wx.connectSocket({
      url: app.config.socketProtocol+"://"+app.config.host+"/cable",
      method:"GET"
    })
    wx.onSocketOpen(res => {
      util.socketSubscribe("GameChannel", this.data.openid)
    })
    wx.onSocketMessage(res => {
      console.log(res)
    })
  }
})
