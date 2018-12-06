const http = require('http')
const request = require('request')
const koaRouter = require('koa-router')
const config = require('../config')
const router = koaRouter()
const Wechat = require('../libs/wechat')
const iconv = require("iconv-lite");
const wechatApi = new Wechat(config.baseInfo)

router.prefix('/wechat')

router.get('/getAccessToken',function (ctx,next) {
  let result = wechatApi.fetchAccessToken();
  let access_token = JSON.parse(JSON.stringify(result)).fulfillmentValue.access_token
  console.log(JSON.parse(JSON.stringify(result)).fulfillmentValue.access_token)

  ctx.body = access_token;
})

router.get('/getCode',async (ctx,next)=>{
  await wechatApi.getCode().then(function (data) {
    ctx.redirect(data);
  })
  // console.log('我信你个鬼2') //
})

router.get('/getInfo',async (ctx,next)=>{
    console.log('showCode => ctx :', ctx.query.code);
    let params=''
    let info=''
    await wechatApi.getOpenID(ctx.query.code).then(function (data) {
      console.log("token和openid:",data)
      params=data
    })

    await wechatApi.getUserInfo(params).then(function (data) {
      console.log("用户信息:",data)
      info=data
    })

    ctx.body = info
    // console.log('我信你个鬼2') //
})
module.exports = router