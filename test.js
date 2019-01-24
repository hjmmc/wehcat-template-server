const WechatServer = require('./index')

let server = new WechatServer({
	appid: '', //微信APPID
	secret: '', //微信Secret
	grant_type: 'client_credential' //详情请看微信开发者文档
})

server.debug = true //输出日志

server.start() //自动更新AccessToken

//开启Http接口服务
server.startHttpApi({
	port: 9999, //监听的端口号
	host: '127.0.0.1' //监听的地址
})


setTimeout(() => {
	console.log(server.AccessToken)

	server.sendTemplate({
		touser: 'user-openid',
		template_id: 'templeid',
		topcolor: '#FF0000',
		data: {
			phone: {
				value: '155xxxxxxxx',
				color: '#173177'
			}
		}
	}).then(ret=>{
		console.log(ret)
	},err=>{
		console.log(err)
	})

}, 1000)