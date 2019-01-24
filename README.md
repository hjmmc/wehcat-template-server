# wehcat-template-server
微信模版消息服务

## Usage

1.install

```
npm install wehcat-template-server --save
```

2.use

```js
const WechatServer = require('wehcat-template-server')

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
```


## Api

### 1.sendTemplate
>发送模版消息

```js
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
```

### 2.refreshAccessToken
>手动刷新accessToken

```js
server.refreshAccessToken().then(accessToken => {
    console.log(accessToken)
})
```

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|touser     |是  |string | 用户OpenID    |
|template_id|是  |string | 模版ID    |
|topcolor     |是  |string | 颜色    |
|data     |是  |object | 字段    |


## Http-API

### 1.sendTemplate
>发送模版消息

**请求URL：** 
- ` http://127.0.0.1:9999/sendTemplate`
  
**请求方式：**
- POST 

**POST参数(JSON)**
```json
{
    "touser": "user-openid",
    "template_id": "templeid",
    "topcolor": "#FF0000",
    "data": {
        "phone": {
            "value": "155xxxxxxxx",
            "color": "#173177"
        }
    }
}
```

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|touser     |是  |string | 用户OpenID    |
|template_id|是  |string | 模版ID    |
|topcolor     |是  |string | 颜色    |
|data     |是  |object | 字段    |

### 2.refreshAccessToken
>主动更新AccessToken

**请求URL：** 
- ` http://127.0.0.1:9999/refreshAccessToken`
  
**请求方式：**
- POST 

**POST参数(JSON)**
```json
{}
```

**结果(JSON)**
```json
{
    "err":0,
    "data":"newAccessToken"
}
```

### 3.getAccessToken
>获取当前的AccessToken

**请求URL：** 
- ` http://127.0.0.1:9999/getAccessToken`
  
**请求方式：**
- POST 

**POST参数(JSON)**
```json
{}
```

**结果(JSON)**
```json
{
    "err":0,
    "data":"accessToken"
}
```

