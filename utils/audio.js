const url = require('./url.js')
const socket = require('./cableSocket.js')
const app = getApp()

const audio_config = {
  day: {
    loop: false,
    next: false,
    bgm: {file: "day_bgm", volume: 0.3},
    voice: {file: "day_start_voice"}
  },
  night: {
    loop: false,
    next: true,
    bgm: {file: "night_bgm", volume: 2},
    voice: {file: "night_start_voice"}
  },
  over_wolf_win: {
    loop: false,
    next: false,
    bgm: {file: "over_bgm", volume: 0.3},
    voice: {file: "over_wolf_win"}
  },
  over_wolf_lose: {
    loop: false,
    next: false,
    bgm: {file: "over_bgm", volume: 0.3},
    voice: {file: "over_wolf_lose"}
  },
  augur: {
    loop: true,
    next: true,
    bgm: {file: "augur_bgm", volume: 0.3},
    voice: {file: "augur_start_voice"},
    fin_voice: {file: "augur_end_voice"}
  },
  long_wolf: {
    loop: true,
    next: true,
    bgm: {file: "long_wolf_bgm", volume: 0.3},
    voice: {file: "long_wolf_start_voice"},
    fin_voice: {file: "long_wolf_end_voice"}
  },
  magician: {
    loop: true,
    next: true,
    bgm: {file: "magician_bgm", volume: 0.5},
    voice: {file: "magician_start_voice"},
    fin_voice: {file: "magician_end_voice"}
  },
  savior: {
    loop: true,
    next: true,
    bgm: {file: "savior_bgm", volume: 0.5},
    voice: {file: "savior_start_voice"},
    fin_voice: {file: "savior_end_voice"}
  },
  seer: {
    loop: true,
    next: true,
    bgm: {file: "seer_bgm", volume: 0.5},
    voice: {file: "seer_start_voice"},
    fin_voice: {file: "seer_end_voice"}
  },
  witch: {
    loop: true,
    next: true,
    bgm: {file: "witch_bgm", volume: 0.3},
    voice: {file: "witch_start_voice"},
    fin_voice: {file: "witch_end_voice"}
  },
  wolf: {
    loop: true,
    next: true,
    bgm: {file: "wolf_bgm", volume: 0.4},
    voice: {file: "wolf_start_voice"},
    fin_voice: {file: "wolf_end_voice"}
  }
}

var current_audio_key = null
var ac_bgm = null
var ac_voice = null
var ac_fin_voice = null

const init = function() {
  ac_bgm = wx.createInnerAudioContext()
  ac_bgm.onEnded(function(){
    var config = audio_config[current_audio_key]
    if (!config.loop && config.next) {
      socket.send("GameChannel", {action: "next_turn"})
    }
    current_audio_key = null
  })
  ac_voice = wx.createInnerAudioContext()
  ac_fin_voice = wx.createInnerAudioContext()
  ac_fin_voice.onEnded(function(){
    setTimeout(function(){
      var config = audio_config[current_audio_key]
      if (config.loop) {
        ac_bgm.stop()
        if (config.next) {
          socket.send("GameChannel", {action: "next_turn"})
        }
      }
      current_audio_key = null
    }, 1000)
  })
}




const start = function(key) {
  var config = audio_config[key]
  setupAudio(ac_bgm, config.bgm, config.loop)
  ac_bgm.play()
  current_audio_key = key

  setTimeout(function(){
    setupAudio(ac_voice, config.voice)
    ac_voice.play()
  }, 1000)
}

const end = function(key) {
  var config = audio_config[key]
  if (config.fin_voice) {
    setTimeout(function(){
      current_audio_key = key
      setupAudio(ac_fin_voice, config.fin_voice)
      ac_fin_voice.play()
    }, 4000)
  }
}


//private

const setupAudio = function(audioContext, config, loop=false) {
  audioContext.src = app.globalData.config.requestProtocol+"://"+app.globalData.config.host+"/audio/"+config.file+".mp3"
  audioContext.loop = loop
  audioContext.volume = config.volume
  audioContext.obeyMuteSwitch = false
}

module.exports = {
  init: init,
  start: start,
  end: end
}
