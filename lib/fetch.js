const _fetch = require('node-fetch')

function fetch(uri, params, options) {
	//未定义处理
	if (typeof options == "undefined") {
		options = {
			method: "GET",
			headers: {}
		}
	}
	if (typeof params == "undefined" || params == "") {
		params = {}
	}

	//method处理
	let m = "POST"
	let t = "FORM"
	if (typeof options == "string") {
		options = options.toUpperCase()
		if (options.indexOf("_") != -1) {
			let mt = options.split("_")
			m = mt[0]
			t = mt[1]
		} else {
			m = options
		}
		options = {}
	} else {
		if (options.method) {
			m = options.method
		}
		if (options.type) {
			t = options.type
		}
	}

	if (!options.headers) options.headers = {}

	options.method = m

	//参数处理
	if (m === "GET" || m === "HEAD") {
		let q = ''
		Object.keys(params).forEach(key => {
			if (typeof params[key] != 'undefined' && params[key] != null) {
				q += '&' + key + '=' + params[key]
			}
		})
		uri += "?" + q.substr(1)
	} else {
		if (t == "JSON") {
			options.headers["Content-Type"] = "application/json"
			options.body = JSON.stringify(params)
		} else if (t == "FORM") {
			if (!options.headers) options.headers = {}
			options.headers["Content-Type"] = "application/x-www-form-urlencoded"
			options.body = ''
			Object.keys(params).forEach(key => {
				if (typeof params[key] != 'undefined' && params[key] != null) {
					options.body += '&' + key + '=' + params[key]
				}
			})
			options.body = options.body.substr(1)
		}
	}
	//请求带cookie
	options.credentials = "include"

	return _fetch(uri, options)
		.then(response => {
			if (response.status >= 200 && response.status < 300) {
				return response.json()
			} else {
				return response.json()
			}
		})
		.then(json => {
			if (!json) {
				throw json
			}
			return json
		})
}

module.exports = fetch