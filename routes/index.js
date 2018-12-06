const router = require('koa-router')()
//模版传参
router.get('/index', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})
//响应字符串
router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})
//响应json字符串
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})





module.exports = router
