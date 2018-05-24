//logs.js
const socket = require('../../utils/cableSocket.js')
const url = require('../../utils/url.js')
const format = require('../../utils/format.js')
const app = getApp()

const turn_trans = {
  init: "准备",
  check_role: "查看身份",
  day: "白天",
  wolf: "夜晚 狼人行动",
  long_wolf: "夜晚 大灰狼行动",
  witch: "夜晚 女巫行动",
  seer: "夜晚 预言家行动",
  savior: "夜晚 守卫行动",
  magician: "夜晚 魔术师行动",
  augur: "夜晚 占卜师行动"
}

Page({
  data: {
    userInfo: {},
    token: wx.getStorageSync('token'),
    status: {},
    players: []
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    socket.connect(url.socket(app.config), ["GameChannel"], this.data.token)
    socket.listen("GameChannel", data => {
      if (data.action == 'alert') {
        //BootstrapDialog.alert data.msg
      }
      else if (data.action == 'play') {
        //audio.play_audio data.audio
      }
      //else if data.action == 'show_role'
        //Wolf.engin.display_role data

      //else if data.action == 'panel'
        //Wolf.engin.panel.show data

      //else if data.action == 'dialog'
        //Wolf.engin.panel.dialog data
      else if(data.action == 'update') {
        if (typeof(data.status) != 'undefined' && data.status != null) {
          data.status.turn = turn_trans[data.status.turn]
          this.setData({
            status: data.status
          })
        }
        if (typeof(data.players) != 'undefined' && data.players != null) {
          var players = []
          for (var pos in data.players) {
            data.players[pos].pos = pos
            data.players[pos].name = format.title(data.players[pos].name)
            data.players[pos].image = url.image(app.config, data.players[pos].image)
          }
          this.setData({
            players: data.players
          })
        }
      }
    })
  }
})
