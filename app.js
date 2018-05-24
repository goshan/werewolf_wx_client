//app.js
const url = require('./utils/url.js')

App({
  onLaunch: function () {
    // 登录
    wx.checkSession({
      fail: () => {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              method: "get",
              url: url.request(this.config)+"/wx/login",
              data: {
                code: res.code
              },
              success: res => {
                if (res.data.token) {
                  wx.setStorageSync('token', res.data.token)
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
      }
    })
  },
  globalData: {
    userInfo: null
  },
  config: {
    host: "127.0.0.1:3000",
    requestProtocol: "http",
    socketProtocol: "ws"
  }
})
