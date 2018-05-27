//logs.js
const socket = require('../../utils/cableSocket.js')
const url = require('../../utils/url.js')
const format = require('../../utils/format.js')
const trans = require('../../utils/trans.js')
const audio = require('../../utils/audio.js')
const app = getApp()



Page({
  data: {
    userInfo: {},
    token: {},
    status: {},
    players: {},

    // modal
    showModal: false,
    modalType: "",
    modalMessage: null,
    modalButtons: [],

    // current player role
    role: {},

    // about skill operation
    panelTip: null,
    showTip: false,
    seatAction: "sit",  // or select
    seatSelect: null,
    selected: {},

    // setting
    setting: {
      god_roles: [
        {key: 'seer', name: "预言家", checked: false},
        {key: 'witch', name: "女巫", checked: false},
        {key: 'hunter', name: "猎人", checked: false},
        {key: 'savior', name: "守卫", checked: false},
        {key: 'idiot', name: "白痴", checked: false},
        {key: 'magician', name: "魔术师", checked: false},
        {key: 'augur', name: "占星师", checked: false}
      ],
      wolf_roles: [
        {key: 'lord_wolf', name: "白狼王", checked: false},
        {key: 'long_wolf', name: "大灰狼", checked: false},
        {key: 'ghost_rider', name: "恶灵骑士", checked: false}
      ],
      villager: 0,
      normal_wolf: 0,
      witch_self_save: null,
      win_cond: null,
      must_kill: null
    }
  },

  onLoad: function () {
    this.setData({
      token: wx.getStorageSync('token'),
      userInfo: app.globalData.userInfo
    })

    audio.init()

    socket.connect(url.socket(app.config), ["GameChannel"], this.data.token.token)
    socket.listen("GameChannel", data => {
      if (data.action == 'alert') {
        wx.showModal({
          title: "提示",
          content: data.msg,
          showCancel: false
        })
      }
      else if (data.action == 'play') {
        this.play(data.audio)
      }
      else if (data.action == 'show_role') {
        this.setData({
          role: trans.role(data.role)
        })
        this.showModal("role")
      }
      else if (data.action == 'panel') {
        this.showPanel(data)
      }
      else if (data.action == 'dialog') {
        this.showSkillDialog(data)
      }
      else if(data.action == 'update') {
        this.update(data)
      }
    })
  },

  play: function(key) {
    if (key == "wolf_win" || key == "wolf_lose") {
      audio.start("over_"+key)
      return
    }

    var keys = key.split('_')
    if (keys[1] == "start") {
      audio.start(keys[0])
    }
    else if (keys[1] == "end") {
      audio.end(keys[0])
    }
  },
  update: function(data) {
    // update status
    if (typeof(data.status) != 'undefined' && data.status != null) {
      var action = data.status.turn == "init" ? "sit" : null
      data.status.turn = trans.turn(data.status.turn)
      this.setData({
        status: data.status,
        seatAction: action
      })
    }
    // update players
    if (typeof(data.players) != 'undefined' && data.players != null) {
      var selected = {}
      for (var pos in data.players) {
        data.players[pos].pos = pos
        data.players[pos].name = format.title(data.players[pos].name)
        data.players[pos].image = url.image(app.config, data.players[pos].image)
        selected[pos] = false
      }
      this.setData({
        players: data.players,
        selected: selected
      })
    }
  },

  showPanel: function(data) {
    this.setData({
      panelTip: trans.panel_tip(data.skill, data),
      showTip: true,
      seatAction: data.skill,
      seatSelect: data.select
    })

    //if(typeof(data.only) != 'undefined' && data.only != null) {
      //var players = this.data.players
      //for (var p in players) {
        //p.selectable = "unSelectable"
      //}
      //for(p in data.only) {
        //players[p-1].selectable = ""
      //}
      //this.setData({
        //players: players
      //})
    //}
  },
  hidePanel: function(){
    this.setData({
      panelTip: null,
      showTip: false,
      seatAction: null,
      seatSelect: null,
      selected: {}
    })
  },

  showSkillDialog: function(data) {
    var buttons = []
    for (var bi in data.buttons) {
      var b = data.buttons[bi]
      var button_content = trans.skill_dialog_button(b.skill)
      buttons.push({
        label: button_content[0],
        cssClass: button_content[1],
        data: b
      })
    }
    this.showModal("skill", trans.skill_dialog(data.skill, data), buttons)
  },

  checkRule: function() {
    wx.request({
      method: "GET",
      url: url.request(app.config)+"/rule",
      data: {
        token: this.data.token.token
      },
      success: res => {
        if (res.data.msg == "Token missing") {
          wx.showToast({
            title: "获取信息失败"
          })
        }
        else {
          wx.showModal({
            title: "当前板子",
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },

  sendSocket: function(e) {
    var data = {action: e.currentTarget.dataset.action}
    if (e.currentTarget.dataset.pos) {
      data.pos = e.currentTarget.dataset.pos
    }
    socket.send("GameChannel", data)
  },

  sendAdminSocket: function(e) {
    var data = {action: e.currentTarget.dataset.action}
    if (e.currentTarget.dataset.pos) {
      data.pos = e.currentTarget.dataset.pos
    }
    socket.send("GameChannel", data)
    this.hideModal()
  },

  useSkill: function(e) {
    var action = this.data.seatAction == "throw" ? "throw" : "skill"
    var selected = []
    for (var s in this.data.selected) {
      if (this.data.selected[s]) {
        selected.push(s)
      }
    }
    if (selected.length == 0) {
      selected = null
    }
    else if (selected.length == 1) {
      selected = selected[0]
    }
    socket.send("GameChannel", {action: action, pos: selected})
    this.hidePanel()
  },

  seatClick: function(e) {
    var pos = e.currentTarget.dataset.pos
    var selected = this.data.selected
    if (selected[pos]) {
      selected[pos] = false
    }
    else {
      if (this.data.seatSelect == "single") {
        for(var s in selected) {
          selected[s] = false
        }
      }
      selected[pos] = true
    }
    this.setData({
      selected: selected
    })
  },

  dialogButtonClick: function(e) {
    var data = e.currentTarget.dataset.config
    if (data.action == "skill") {
      socket.send("GameChannel", {action: "skill", pos: data.value})
    }
    else if (data.action == "panel") {
      this.showPanel(data)
    }
    this.hideModal()
  },

  prepareThrow: function(e) {
    this.showPanel({skill: "throw", select: "multiple"})
    this.hideModal()
  },

  showSetting: function() {
    wx.request({
      method: "GET",
      url: url.request(app.config)+"/setting",
      data: {
        token: this.data.token.token
      },
      success: data => {
        console.log(data)
        for (var r in data.god_roles) {
          dfd
        }
        this.showModal("setting")
      }
    })
  },

  showAdmin: function() {
    if (this.data.token.permission == "lord") {
      this.showModal("admin")
    }
  },
  showModal: function(type, message=null, buttons=[]) {
    this.setData({
      modalType: type,
      showModal: true,
      modalMessage: message,
      modalButtons: buttons
    })
  },
  hideModal: function() {
    this.setData({
      modalType: "",
      showModal: false,
      modalButtons: []
    })
  }
})
