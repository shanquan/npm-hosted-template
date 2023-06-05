/**
 * @author: wang.weili
 * @since : 2020/11/12
 * @description: 框架公共文件，慎重修改
 */
import axios from 'axios'
import {
    // Message,
    Loading,MessageBox,Notification} from 'element-ui'
import i18n from '@/i18n'
import appApi from '@/plugins/app/api'
var baseUrl = '/',
    token = '',
    projectCode = '',
    projectId = '',
    macAddress = '',
    cmLoading,
    showLoading = false, // 是否显示加载中
    showError = true; // 是否处理请求错误

/**
 * apiConfig 配置项
 * axios headers: 
 * showLoading // 是否显示加载中，默认：false
 * showError // 是否自动处理请求错误，默认：true
 * playPassAudio // 是否播放成功音频，默认：false
 * playFailAudio // 是否播放失败音频，默认：false
 * 
 */
const MOCKMETHORDS = ['save', 'updateById', 'removeById', 'remoteListId', 'changePwd'], // 模拟接口默认返回PASS的接口名
    user_url = 'user/api/';
var promptError = true, // 请求错误是否弹窗，false时使用消息提示框
mock = false;

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 30 * 60 * 1000;

function getMethod(url) {
    let pathIdx = url.lastIndexOf("?");
    pathIdx = pathIdx > 0 ? pathIdx : url.length
    let arr = url.substring(0, pathIdx).split('/');
    return arr[arr.length - 2] + "/" + arr[arr.length - 1]
}

const setLangs = function(lang){
    if(lang&&lang.split('-').length)
    axios.defaults.headers.common['Accept-Language'] = lang.split('-')[0];
}
const setForMock = function() {
    axios.defaults.baseURL = process.env.BASE_URL + 'mock/';
    axios.interceptors.request.use((config) => {
        // console.log(config)
        if(config.url.startsWith('mock')){
            config.url = config.url.slice(5)
            return config
        }
        let mockUrl = getMethod(config.url).replace(/\//g, "_");
        let method = mockUrl.split('_')[1];
        if (method && MOCKMETHORDS.includes(method))
            mockUrl = 'success'
        config.url = mockUrl + '.json';
        config.method = 'get';
        return config;
    })
}
if (mock) {
    setForMock();
} else {
    setLangs(i18n.locale);
    axios.interceptors.request.use((config) => {
        if (Api.showLoading||config.headers.showLoading) {
            cmLoading = Loading.service({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        }
        if(Api.mock){
            return config
        }
        // 非user类接口请求统一添加projectCode前缀
        if (!config.url.startsWith('user') && (!config.url.startsWith('http://')) && Api.projectCode) {
            config.url = `${Api.projectCode}/` + config.url;
        }
        config.headers['request-startTime'] = new Date().getTime()
        if(config.headers.addLog!==false)
        Api.addLog({
            traceId: config.url,
            type: 'pda_api',
            status: 's',
            logLevel: 'INFO',
            content: ' Request: \n'+JSON.stringify(config)
        })
        return config;
    })
}
const showErrMsg = function(title, msg) {
        if(Api.promptError){
            MessageBox.alert(msg, title, {
                type: "error",
                callback: (res) => {
                    if(res=='cancel'){
                        MessageBox.close()
                    }
                }
            })
        }else{
            // Message({
            //     message: title+' ,message: '+msg,
            //     type: "error",
            //     duration: 6000, // 0: 不自动关闭
            //     showClose: true
            // });
            Notification({
                title: title,
                message: msg,
                type: "error",
                duration: 6000, // 0: 不自动关闭
                position: 'bottom-right'
            })
        }
}
/**
 * promptError: 是否默认弹框报错？ 客户端或PDA设置为否
 * CODE: 0 或404,500等，服务器问题
 * CODE: -1 接口报错，RESULT:FAIL
 * CODE: -2 JSON解析错误，返回非JSON格式
 */
axios.interceptors.response.use(function(response) {
        const cost = (new Date().getTime() - response.config.headers['request-startTime'])
        if(response.config.headers.addLog!==false)
        Api.addLog({
            traceId: response.config.url,
            type: 'pda_api',
            status: 'e',
            logLevel: 'INFO',
            cost: cost,
            content: ' Response: \n'+JSON.stringify(response.data)
        })
        if (cmLoading) {
            Api.showLoading = false;
            cmLoading.close()
        }
        const execErr = function() {
            if(!Api.promptError&&response.config.headers.playFailAudio==true)
            Api.playFailAudio();
            if (Api.showError&&response.config.headers.showError!==false&& appApi.checkInvalid(response)) {
                localStorage.removeItem("aSession");
                window.location.href = `${window.location.origin}${process.env.BASE_URL?process.env.BASE_URL:'/'}index.html`;
                return;
            }
            let method = getMethod(response.config.url);
            if (Api.showError&&response.config.headers.showError!==false)
                showErrMsg(method + i18n.t('L00034'), response.data.MESSAGE);
            response.data.URL = response.config.url;
            response.data.METHOD = method;
            Api.showError = true;
            // console.log(response.data)
        }
        if (appApi.checkResult(response)) {
            return response.data;
        } else if (appApi.checkPass(response)) {
            if(!Api.promptError&&response.config.headers.playPassAudio==true)
            Api.playPassAudio();
            Api.showError = true;
            return response.data;
        } else {
            // 请求responseType=blob, 但返回的是json数据： 先转换blob为json
            if (response.request.responseType == 'blob' && response.headers['content-type'].indexOf('application/json') > -1) {
                const reader = new FileReader();
                reader.readAsText(response.data, 'utf-8');
                reader.onload = function() {
                    try {
                        response.data = JSON.parse(reader.result);
                    } catch (e) {
                        response.data.CODE = -2;
                        response.data.MESSAGE = "json解析错误：" + e.toString();
                    }
                    execErr();
                }
                return Promise.reject(response.data);
            } else {
                execErr();
                return Promise.reject(response.data);
            }
        }
    },
    function(error) {
        // console.info([error])
        const cost = (new Date().getTime() - error.config.headers['request-startTime'])
        if(error.config.headers.addLog!==false)
        Api.addLog({
            traceId: error.config.url,
            type: 'pda_api',
            status: 'e',
            logLevel: 'ERROR',
            cost: cost,
            content: ' Response Error: \n'+JSON.stringify(error)
        })
        if(!Api.promptError&&error.config.headers.playFailAudio == true)
        Api.playFailAudio();
        if (cmLoading) {
            Api.showLoading = false;
            cmLoading.close()
        }
        let code = 0,method = "";
        if (error.config)
            method = getMethod(error.config.url);
        if (error.response) {
            code = error.response.status;
        }
        if (Api.showError&&error.config.headers.showError!==false)
            showErrMsg(`${method}:${code}`, code == 0 ? i18n.t('L00035') : error.toString())
        Api.showError = true;
        const data = {
            CODE: code,
            MESSAGE: code == 0 ? i18n.t('L00035') : error.toString(),
            URL: error.config.url,
            METHOD: method
        }
        // console.log(data)
        return Promise.reject(data);
    });

const Api = {
    axios,
    baseUrl,
    user_url,
    mock,
    projectCode,
    projectId,
    macAddress,
    token,
    setLangs,
    setForMock,
    showError,
    promptError,
    showLoading,
    ...appApi,
    playPassAudio(){
        let $el = document.getElementById('passAudio');
        if($el)
        $el.play();
    },
    playFailAudio(){
        let $el = document.getElementById('failAudio');
        if($el)
        $el.play();
    },
    login(data) {
        let promise = axios.post(`${user_url}login`, data);
        return promise;
    },
    getMockFile(name) {
        let promise = axios.get(`mock/${name}`);
        return promise;
    },
    // 登录页支持query.baseUrl配置baseUrl
    setBaseUrl(bl) {
        if (this.mock) {
            return false
        }
        let pattern = "^https?://(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\." +
            "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\." +
            "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\." +
            "(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)(:\\d*)?.*(/)?$"
        if (new RegExp(pattern).test(bl) || /^https?:\/\/localhost(:\\d*)?.*(\/)?$/.test(bl) || /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(bl)) {
            this.baseUrl = bl;
            axios.defaults.baseURL = bl;
        }
    },
    setToken(token) {
        this.token = token;
        axios.defaults.headers.common['token'] = token;
    },
    setProjectId(pId) {
        this.projectId = pId;
        axios.defaults.headers.common['projectId'] = pId;
    },
    changePwd(data) {
        let promise = axios.post(`${user_url}mesSysUser/changePwd`, data);
        return promise;
    },
    validateRandomKey(data) {
        let promise = axios.post(`user/exi/resetPwd/validateRandomKey`, data);
        return promise;
    },
    resetPwd(data) {
        let promise = axios.post(`user/exi/resetPwd/resetPwd`, data);
        return promise;
    },
    addLog(body){
        var timeNow = new Date();
        timeNow.setHours(timeNow.getHours() + 8);
        timeNow = timeNow.toJSON();
        body.time = timeNow.replace('T',' ').substring(0,19);
        if(this.baseUrl=='/'){
            body.content = `Url:${window.location.origin}/${body.traceId} `+body.content;
        }else{
            body.content = `Url:${this.baseUrl}/${body.traceId} `+body.content;
        }
        body.traceId = ""
        if(this.macAddress)
        body.mac = this.macAddress
        if(this.projectId)
        body.project = this.projectId
        appApi.addLog(body);
    }
}
export default Api;