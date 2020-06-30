/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'http://local.chawuliu2018.com/api/';
// var hostM = 'http://local.chawuliu2018.com/';
var host = 'https://www.hycwl.cn/api/';
var hostM = 'https://www.hycwl.cn/';
var apiVer = 'v1'
var apiOpenId = 'getopenid'
var hostApi = host + apiVer
var uploadApi = host + "upload/image"
var uploadRecordApi = host + "upload/record"
// var cityApi = 'https://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data='
// var cityApi = host + "area?code="
var cityApi = host + "area/"
var baiduAk = '------'
var baiduApi = 'https://api.map.baidu.com/geocoder/v2/?ak='+baiduAk
var config = {

    // urls
    service: {
        host,
        hostM,

        // OPENID 获取
        openIdUrl: `${host}`+apiOpenId,
        // 登录地址，用于建立会话
        loginUrl: `${hostApi}/login`,

        zhuanxianUrl: `${hostApi}/zhuanxian`,
        
        sellmsgUrl: `${hostApi}/sellmsg`,

        zhaopinUrl: `${hostApi}/zhaopin`,

        // 请求用户信息
        contactUrl: `${hostApi}/contact`,

        // 收藏
        favUrl: `${hostApi}/fav`,
        
        // 新闻
        newsUrl: `${hostApi}/news`,
        
        // 上传接口
        uploadUrl: `${uploadApi}`,
        uploadRecordUrl: `${uploadRecordApi}`,

        // 获取省市接口API
        cityApi: `${cityApi}`,

        baiduApi: `${baiduApi}`

        // 测试的信道服务地址
        // tunnelUrl: `${host}/weapp/tunnel`

    },
    // sign:getSign(a,b,c,d,e)
};
/* 
function getSign(a,b,c,d,e) {
    // console.log(Array[a,b,c,d,e])
    console.log('d:'+d+';e:'+e);
    return 'sign=123123';
} */

module.exports = config;