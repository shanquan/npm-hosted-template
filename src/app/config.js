/**
 * @author wang.weili
 * @since 2023/02/28
 * @description 系统/项目全局唯一定制配置
 * 
 */
import axios from 'axios'
// 项目自定义api配置，可覆盖默认api.js
var appApi = {
    macAddress: '',
    project:{},
    app_url: "app/api/",
    mes_url: "mes/api/",
    checkInvalid(response){
        return response.data.MESSAGE && response.data.MESSAGE.indexOf('登录') > -1
    },
    checkResult(response){ // 非json格式，优先checkPass判断并返回
        return response.headers['content-type'].indexOf('application/json') == -1
    },
    checkPass(response){ // json格式返回PASS/FAIL判断规则
        return response.data.RESULT == "PASS"
    },
    getList(url, data) {
        data = data || {}
        let promise = axios.post(`${url}/getList`, data);
        return promise;
    },
    getPage(url, data, currentPageNo, pageSize) {
        data = data || {}
        Object.assign(data, {
            "currentPageNo": currentPageNo,
            "pageSize": pageSize
        })
        let promise = axios.post(`${url}/getPage`, data);
        return promise;
    },
    getById(url, id, params) {
        let promise = axios.get(`${url}/getById?id=${id}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
        });
        return promise;
    },
    save(url, data) {
        let promise = axios.post(`${url}/save`, data);
        return promise;
    },
    updateById(url, data) {
        let promise = axios.post(`${url}/updateById`, data);
        return promise;
    },
    removeById(url, id, params) {
        let promise = axios.get(`${url}/removeById?id=${id}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
        });
        return promise;
    },
    removeByIds(url, ids, params) {
        let promise = axios.get(`${url}/removeByIds?&ids=${ids}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: params
        });
        return promise;
    },
    /**
     * @function addVConsoleLog 
     * @description 添加vConsole日志，支持导出与复制
     */
    addLog(body,log_url){
        if(log_url&&(body.mac||body.ip)){
            axios.create().post(`${log_url}log/exi/log`,body)
        }
        if(window.vConsole){
            if(body.status=='s')
            window.vConsole.log.info(`${body.time},${body.content}\n`);
            if(body.status=='e')
            window.vConsole.log.info(`${body.time},${body.traceId},${body.cost},${body.content}\n`);
        }
    }, 
}

// 项目自定义配置，可覆盖默认main.js中的appConfigDefault
var appConfig = {
    menuRoot: 'web',
    menuMobile: 'pda',
    homePath: '/', // 登录后主页路径，默认: /, 客户端配置：/config
    hasBreadcrumb: true,
    hasTabs: false,
    addNewTabMode: true,
    localTheme: false, // 仅本地主题
    // patternRule: { pattern: /^[^`!#%&+=<>?:"{}|,.\/;'\\[\]·！#￥%……&（）——+={}|《》？：“”【】、；‘'，。、]+$/, message: 'L00033', trigger: 'blur' }, // 名称（含中文）/通用输入规则,黑名单,
    // patternEnRule: { pattern: /^[A-Za-z0-9\*\-_(\)\^@~\$]+$/, message: 'L00036', trigger: 'blur' }, // 英文数字/通用输入规则,白名单
    // patternDspRule: { pattern: /^[A-Za-z0-9\u4e00-\u9fa5\*\-\_\(\)\^@~\$ ,\.\?;:!，。；、？！\r\n]+$/, message: 'L00033', trigger: 'blur' }, // 描述输入规则，白名单
    // boolList: [{ value: true }, { value: false }],
    statusOptions: [{ label: 'enabled', value: 0 }, { label: 'disabled', value: 1 }],
    Car_Trial:{
        localTheme: true
    }
}
/**
 * 自定义翻译字段，支持覆盖同名框架基础字段
 * 1. 系统覆盖默认框架字段，通过vue.config.js中的process.env.VUE_APP_CODE，打包时匹配
 * 2. 项目覆盖默认框架字段，main.js中initSession通过项目代码匹配，示例：Home.vue L10221
 */
let langs = {
    BYD_FLAMES: {
        // 项目自定义字段，选择项目后再合并覆盖默认字段
        zatanna: {
            L10221: 'zatanna试制工厂'
        }
    },
    BYD_PLM: {
        // 系统覆盖默认框架字段，适用登录页，项目未选择
        L10206: '电子事业群产品生命周期管理系统',
        L10051: 'Electronics Product Lifecycle Management',
        L10052: '测试环境',
        L10053: 'EPLM',
    },
    // process.env.VUE_APP_CUSTOMIZE 优先级高于process.env.VUE_APP_CODE
    Car_Trial: {
        L10206: '汽车规划院智慧工厂管理系统'
    }
}

if(langs[process.env.VUE_APP_CUSTOMIZE]){
    Object.assign(langs[process.env.VUE_APP_CODE],langs[process.env.VUE_APP_CUSTOMIZE])
    delete langs[process.env.VUE_APP_CUSTOMIZE]
}

if(appApi[process.env.VUE_APP_CUSTOMIZE]){
    Object.assign(appApi,appApi[process.env.VUE_APP_CUSTOMIZE])
    delete appApi[process.env.VUE_APP_CUSTOMIZE]
}

if(appConfig[process.env.VUE_APP_CUSTOMIZE]){
    Object.assign(appConfig,appConfig[process.env.VUE_APP_CUSTOMIZE])
    delete appConfig[process.env.VUE_APP_CUSTOMIZE]
}

export var applang = langs[process.env.VUE_APP_CODE];
export var appApi;
export var appConfig;