var socketRetryInterval = null
var socketUrl = null
var socketToken = null
var will_retry = true

const connect = (url, channels, token) => {
  console.log("start to connect socket")
  socketUrl = url
  socketToken = token
  will_retry = true

  wx.connectSocket({
    url: socketUrl,
    method:"GET"
  })

  wx.onSocketOpen(res => {
    for (var i in channels) {
      subscribe(channels[i])
    }
  })

  wx.onSocketClose(res => {
    console.log("socket connection closed")
    console.log(res)

    if (will_retry) {
      socketRetryInterval = setInterval(() => {
        console.log("retry to connect...")
        wx.connectSocket({
          url: socketUrl,
          method:"GET"
        })
      }, 1000)
    }
  })
}

const disconnect = () => {
  console.log("close socket")
  will_retry = false
  wx.closeSocket()
}

const listen = (channel, fallback) => {
  wx.onSocketMessage(res => {
    var data = JSON.parse(res.data)
    // not parse handshake msg
    if (data.type == "welcome" || data.type == "ping") {
      // socket is ok, no need retry
      clearInterval(socketRetryInterval)
      return
    }

    var res_ch = JSON.parse(data.identifier).channel
    if (res_ch == channel) {
      if (data.type == "confirm_subscription") {
        console.log("connected socket channel "+res_ch)
      }
      else if (data.message) {
        console.log("recieved data:")
        console.log(data.message)
        fallback(data.message)
      }
    }
  })
}

const send = (channel, message) => {
  console.log("send data:")
  console.log(message)
  var identifier = JSON.stringify({
    channel: channel,
    f: socketToken
  })
  var data = JSON.stringify({
    command: "message",
    identifier: identifier,
    data: JSON.stringify(message)
  })
  wx.sendSocketMessage({
    data: data
  })
}

// private

const subscribe = (channel) => {
  var identifier = JSON.stringify({
    channel: channel,
    f: socketToken
  })
  var data = JSON.stringify({
    command: "subscribe",
    identifier: identifier
  })
  wx.sendSocketMessage({
    data: data
  })
}

module.exports = {
  connect: connect,
  disconnect: disconnect,
  listen: listen,
  send: send
}
