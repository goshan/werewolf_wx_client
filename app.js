//app.js

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        wx.setStorageSync('login_res_code', res.code)
      }
    })
  },
  globalData: {
    userInfo: null,
    config: {
      host: "werewolf.paqdan.net",
      requestProtocol: "https",
      socketProtocol: "wss"
    }
  }
})
