/**
 * @author wang.weili
 * @since : 2023/03/31
 * @description: app api定义
 */
import axios from 'axios'

export default {
    app_url: "app/api/",
    checkInvalid(response){
        return response.data.MESSAGE && response.data.MESSAGE.indexOf('登录') > -1
    },
    checkResult(response){ // 非json格式，优先checkPass判断并返回
        return response.headers['content-type'] == 'application/msexcel'
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
            axios.post(`${log_url}log/exi/log`,body, {
                headers: {
                    addLog:false,
                    showError: false,
                    token:''
                },
            })
        }
        if(window.vConsole){
            if(body.status=='s')
            window.vConsole.log.info(`${body.time},${body.content}\n`);
            if(body.status=='e')
            window.vConsole.log.info(`${body.time},${body.traceId},${body.cost},${body.content}\n`);
        }
    },
}