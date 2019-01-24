const fetch = require('./fetch.js')

class WechatServer {
	constructor(config) {
		this.config = config
		this.AccessToken = null
	}

	refreshAccessToken() {
		this.log('refreshAccessToken...')
		return fetch('https://api.weixin.qq.com/cgi-bin/token', {
			appid: this.config.appid,
			secret: this.config.secret,
			grant_type: this.config.grant_type,
		}, 'GET').then(ret => {
			if (!ret.access_token) {
				throw ret
			}
			this.AccessToken = ret.access_token
			this.log('refreshAccessToken success')
			return ret.access_token
		}).catch(err => {
			this.AccessToken = null
			console.error('refreshAccessToken error')
			throw err
		})
	}

	sendTemplate(param) {
		return fetch('https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + this.AccessToken, param, 'POST_JSON').then(ret => {
			if (ret.errcode != 0) {
				if (ret.errcode == 40001) {
					//access_token 失效
					//刷新AccessToken后再次尝试发送
					return this.refreshAccessToken().then(() => {
						return this.sendTemplate(param)
					})
				} else {
					throw ret
				}
			}
			return ret
		}).catch(err => {
			this.log('sendTemplate error', JSON.stringify(param))
			throw err
		})
	}

	start() {
		this.refreshAccessToken().catch(err => {})
		setInterval(() => {
			this.refreshAccessToken().catch(err => {})
		}, 7000 * 1000)
	}

	startHttpApi(config) {
		const express = require('express')
		const bodyParser = require('body-parser')

		var app = express()
		app.use(bodyParser.urlencoded({
			extended: true
		}))
		app.use(bodyParser.json())

		app.get('/getAccessToken', (req, res) => {
			if (this.AccessToken) {
				res.json({
					err: 0,
					data: this.AccessToken
				})
			} else {
				res.json({
					err: -1,
				})
			}
		})

		app.post('/refreshAccessToken', (req, res) => {
			refreshAccessToken().then(accessToken => {
				res.json({
					err: 0,
					data: accessToken
				})
			}).catch(err => {
				res.json({
					err: -1
				})
			})
		})

		app.post('/sendTemplate', (req, res) => {
			sendTemplate(req.body).then(ret => {
				res.json({
					err: 0,
					data: ret.msgid
				})
			}).catch(err => {
				res.json({
					err: -1
				})
			})
		})

		app.listen(config.port, config.host, () => {
			this.log(`http server listen http://${config.host}:${config.port}`)
		})

		return app
	}

	log(...args) {
		if (this.debug) {
			console.log(...args)
		}
	}
}

module.exports = WechatServer