const socketSubscribe = (channel, openid) => {
  const identifier = JSON.stringify({
    channel: channel,
    openid: openid
  })
  const data = JSON.stringify({
    command: "subscribe",
    identifier: identifier
  })
  wx.sendSocketMessage({
    data: data
  })
}

const socketListen = (channel, fallback) => {
  wx.onSocketMessage(res => {
    if(JSON.parse(res).identifier)
  })
}

module.exports = {
  socketSubscribe: socketSubscribe
}
