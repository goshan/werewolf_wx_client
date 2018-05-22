//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    players: []
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  }
})
