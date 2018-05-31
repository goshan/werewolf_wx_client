const app = getApp()


const request = function() {
  return app.globalData.config.requestProtocol+"://"+app.globalData.config.host+"/wx"
}

const socket = function() {
  return app.globalData.config.socketProtocol+"://"+app.globalData.config.host+"/cable"
}

const image = function(url) {
  if (!url) {
    return null
  }
  else if(url.startsWith("http")) {
    return url
  }
  else if(url.startsWith("/")) {
    return app.globalData.config.requestProtocol+"://"+app.globalData.config.host+"/img"+url
  }
  else {
    return app.globalData.config.requestProtocol+"://"+app.globalData.config.host+"/img/"+url
  }
}

module.exports = {
  request: request,
  socket: socket,
  image: image
}
