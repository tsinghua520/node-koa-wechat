const util = require('./libs/utils')
const path = require('path')
const wechat_file = path.join(__dirname, './database/wechat.txt')

const config = {
  baseInfo:{
    appID:'wx6466fea058360c59',
    appSecret:'31e9b6abf4f5ebb03b2f58262942e536',
    token:'weareoneteam',
    getAccessToken: function() {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function(data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    }
  }
}

module.exports=config