const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const util = require('./utils')
const fs = require('fs')

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
let api = {
    accessToken: `${prefix}token?grant_type=client_credential`,
    upload: `${prefix}media/upload?`
}

function Wechat(opts) {
    let that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts
        .saveAccessToken
        this
        .fetchAccessToken()
}

Wechat.prototype.uploadMaterial = function (type, filepath) {
    let that = this
    let form = {
        media: fs.createReadStream(filepath)
    }

    let appID = this.appID
    let appSecret = this.appSecret
    return new Promise((resolve, reject) => {
        that
            .fetchAccessToken()
            .then((data) => {
                let url = `${api
                    .upload}&access_token=${data
                    .access_token}&type=${type}`
                    request({method: 'POST', url: url, formData: form, json: true})
                    .then((res) => {
                        console.log('fetchAccessToken - res.body: ', res.body)
                        let _data = res.body
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error('Upload material fails')
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
                })
    })
}

Wechat.prototype.fetchAccessToken = function () {
    let that = this
    // console.log('fetchAccessToken - this: ', this)
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this)
        }
    }

    //获取wechat.txt中的access_token,进行校验和操作
    this
        .getAccessToken()
        .then(function (data) {
            if (!data.length) {
                //为空时
                return that.updateAccessToken(data)
            }
            try {
                data = JSON.parse(data)
            } catch (e) {
                //不能转换为json数据格式时
                return that.updateAccessToken(data)
            }
            if (that.isValidAccessToken(data)) {
                //可用时
                return Promise.resolve(data)
            } else {
                //过期时
                return that.updateAccessToken()
            }
        })
        .then(function (data) {
            if (data) {
                //刷新access_token
                console.log('data - access_token :', data.access_token)
                that.access_token = data.access_token
                that.expires_in = data
                    .expires_in
                    that
                    .saveAccessToken(data)

                return Promise.resolve(data)
            } else {
                console.log('access_token未刷新')
            }
        })
}

//获取/更新access_token
Wechat.prototype.updateAccessToken = function () {
    let appID = this.appID
    let appSecret = this.appSecret
    // https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=
    // APPID&secret=APPSECRET
    let url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}).then(function (res) {
            let data = res.body
            let now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 20) * 1000
            data.expires_in = expires_in
            resolve(data)
        })
    })
}

//校验access_token是否过期
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());

    if (now < expires_in) { //判断是否过期
        return true;
    } else {
        return false;
    }
}

//获取code
Wechat.prototype.getCode = function (data) {
    let appID = this.appID
    let appSecret = this.appSecret
    let redirect = 'http://119.3.58.254:8099/wechat/getInfo'
    let scope = 'snsapi_userinfo'
    let state = '1'
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
    //let url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`
    return new Promise(function (resolve, reject) {
        resolve(url)
    })
}

//获取openID
Wechat.prototype.getOpenID = function (code) {
    let appID = this.appID
    let appSecret = this.appSecret
    let appCode = code
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appID}&secret=${appSecret}&code=${appCode}&grant_type=authorization_code`
    //let url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}).then(function (res) {
            //返回
            resolve(res.body)
        })
    })
}

Wechat.prototype.getUserInfo = function (data) {
    let {access_token,openid} = data
    console.log(access_token+' 和和和 '+openid);
    let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}).then(function (res) {
            resolve(res.body)
        })
    })
}

Wechat.prototype.reply = function () {
    let content = this.body
    let message = this.weixin
    let xml = util.tpl(content, message)
    this.status = 200
    this.type = 'application/xml'
    this.body = xml
}

module.exports = Wechat