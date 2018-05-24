const str_length = 10
const title = function(str) {
  if (!str) {
    return null
  }
  else if (str.length <= str_length) {
    return str
  }
  else {
    return str.substring(0, str_length)
  }
}

module.exports = {
  title: title
}
