const request = function(config) {
  return config.requestProtocol+"://"+config.host
}

const socket = function(config) {
  return config.socketProtocol+"://"+config.host+"/cable"
}

const image = function(config, url) {
  if (!url) {
    return null
  }
  else if(url.startsWith("http")) {
    return url
  }
  else if(url.startsWith("/")) {
    return request(config)+url
  }
  else {
    return request(config)+"/"+url
  }
}

module.exports = {
  request: request,
  socket: socket,
  image: image
}
