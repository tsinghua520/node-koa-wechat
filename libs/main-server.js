const sha1 = require('sha1')

/**
* 签名生成
* @param {string} timestamp
* @param {string} nonce
* @param {string} token
*/
let getSignature = function(timestamp, nonce, token) {
  // let hash = crypto.createHash('sha1')
  const arr = [token, timestamp, nonce].sort()
  return sha1(arr.join(''))
  // return hash.digest('hex')
}

module.exports = function (opts) {
  return async function (ctx,next) {
    console.log('上下文对象 :', ctx.url);
    ctx.body='ok'
    //配置中的token
    // const TOKEN = opts.token
    // //变量解构
    // const { signature, timestamp, nonce, echostr } = ctx.query
    // if(ctx.url==='/favicon.ico') ctx.body = '';
    // //校验
    // if (ctx.method === 'GET'){
    //   if (signature === getSignature(timestamp, nonce, TOKEN)) {
    //     ctx.body = echostr + ''
    //   }else {
    //     ctx.body = 'error'
    //   }
    // }else if(ctx.method === 'POST') {
    //   let content = ''
    //   if (signature !== getSignature(timestamp, nonce, TOKEN)) {
    //     ctx.body = 'error'
    //     return false
    //   }
    // }
  }
}
