//app.js

App({
  onLaunch: function () {
    // 登录
    wx.checkSession({
      fail: () => {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.errMsg == "login:ok") {
              wx.request({
                method: "get",
                url: this.config.requestProtocol+"://"+this.config.host+"/wx/login",
                data: {
                  code: res.code
                },
                success: res => {
                  if (res.data.openid) {
                    wx.setStorageSync('session', res.data)
                  }
                  else {
                    wx.showToast({
                      title: "服务器通信失败"
                    })
                  }
                }
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
    host: "127.0.0.1:3000",
    requestProtocol: "http",
    socketProtocol: "ws"
  }
})
