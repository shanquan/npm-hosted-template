/**
 * @author wang.weili
 * @since : 2023/03/31
 * @description: app api定义
 */
import axios from 'axios'
import VConsole from 'vconsole';
/**
 * 日志文件句柄，日志序列（写完一条再写下一条，避免异步写时序混乱）
 */
var logfileEntry, logBlobList = [];
export default {
    logfileEntry,
    pre_url: process.env.VUE_APP_PRE_URL,
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
    initVConsole(){
        window.vConsole = new VConsole()
    },
    /**
     * @function writeLog 接口写入日志文件
     * 仅支持android
     * @param  {string} str 接口写入日志文件 2018-4-22.txt
     */
    writeLog(str){
        var timeNow = new Date();
        timeNow.setHours(timeNow.getHours() + 8);
        timeNow = timeNow.toJSON();
        if(window.vConsole){
            window.vConsole.log.info(timeNow+str+'\n');
        }
        if (this.logfileEntry) {
            var dataObj = new Blob([timeNow + str + '\n'], { type: 'text/plain' });
            logBlobList.push(dataObj);
            if (window.cordova && logBlobList.length) {
                this.writeFile();
            }
        }
    },
    /**
     * @function writeFile 写日志文件(末尾追加)
     */
    writeFile(){
        if (logBlobList.length)
        this.logfileEntry.createWriter((fileWriter)=>{
            fileWriter.onwriteend = ()=>{
                logBlobList.shift();
                this.writeFile();
            };
            fileWriter.onerror = function(e) {
                console.log("Failed file write: " + e.toString());
            };
            // If we are appending data to file, go to the end of the file.
            var isAppend = true;
            if (isAppend) {
                try {
                    fileWriter.seek(fileWriter.length);
                } catch (e) {
                    console.log("file doesn't exist!");
                }
            }
            fileWriter.write(logBlobList[0]);
        });
    }
}