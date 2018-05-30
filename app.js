//app.js
const url = require('./utils/url.js')

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          method: "get",
          url: url.request(this.config)+"/login",
          data: {
            code: res.code
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
    })
  },
  globalData: {
    userInfo: null
  },
  config: {
    host: "werewolf.paqdan.net",
    requestProtocol: "https",
    socketProtocol: "wss"
  }
})
