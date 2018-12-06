const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('cors')

const index = require('./routes/index')
const users = require('./routes/users')
const wechat = require('./routes/wechat')


const mainServer = require('./libs/main-server')
const config = require('./config')
// error handler
//koa-onerror插件
onerror(app)

// middlewares
//koa-bodyparser
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
//koa-json
app.use(json())
//koa-logger
app.use(logger())
//静态文件路径(如：http://localhost:3001/stylesheets/style.css)
app.use(require('koa-static')(__dirname + '/public'))
//koa-views
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

//设置请求头部，解决跨域
app.use(cors())

// logger （async await 异步函数）
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(wechat.routes(), wechat.allowedMethods())

//启动服务器服务
app.use(mainServer(config.baseInfo))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
