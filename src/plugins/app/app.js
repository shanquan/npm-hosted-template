/**
 * @author: wang.weili
 * @since : 2023/2/21
 * @description: 项目定制全局数据及公共方法,directives,filters
 */
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import sysRouter from 'user-sys/router.sys'
import sysLang from 'user-sys/zh-CN.sys'
import appApi from '@/plugins/app/api'

/**
 * global components
 */
/**
 * global filters
 */
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

/**
 * global data, cache or localstorage
 * @example const globalSet = true;
 */
// 一级菜单图标配置，支持菜单模块配置，默认图标：el-icon-tickets
const iconSet = [{
  "index": "base",
  "icon": "el-icon-tickets"
}, {
  "index": "noLib",
  "icon": "el-icon-postcard"
}, {
  "index": "report",
  "icon": "el-icon-data-analysis"
}, {
  "index": "pda",
  "icon": "el-icon-mobile"
}, {
  "icon": "el-icon-s-cooperation",
  "index": "repair"
}, {
  "icon": "el-icon-setting",
  "index": "sys"
}]

export default {
  config:{ // 项目自定义配置，可覆盖默认main.js中的appConfigDefault
    iconSet,
    // patternRule: { pattern: /^[^`!#%&+=<>?:"{}|,.\/;'\\[\]·！#￥%……&（）——+={}|《》？：“”【】、；‘'，。、]+$/, message: 'L00033', trigger: 'blur' }, // 名称（含中文）/通用输入规则,黑名单,
    // patternEnRule: { pattern: /^[A-Za-z0-9\*\-_(\)\^@~\$]+$/, message: 'L00036', trigger: 'blur' }, // 英文数字/通用输入规则,白名单
    // patternDspRule: { pattern: /^[A-Za-z0-9\u4e00-\u9fa5\*\-\_\(\)\^@~\$ ,\.\?;:!，。；、？！\r\n]+$/, message: 'L00033', trigger: 'blur' }, // 描述输入规则，白名单
    // boolList: [{ value: true }, { value: false }],
    // statusOptions: [{ label: 'enabled', value: 0 }, { label: 'disabled', value: 1 }],
  },
  routers: [].concat(sysRouter.router),
  langs:{...sysLang},
  data:{ // 项目自定义全局数据
  },
  mobileClass(){
    if(/Android|Chrome|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    return 'android'
    if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent))
    return 'ios'
    return ''
  },
  getBuffer(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  },
  beforeHome(vm){
    // console.log(vm)
    // console.log(store.state.user)
    return new Promise((resolve,reject)=>{
      // 接口获取systemArr，作为框架公共数据，直接放入main.js的initSession函数中也可以，这里仅做示例如何添加应用定制获取数据示例代码
      // const systemArr = [{"projectName":"Zatanna","projectCode":"zatanna","url":"http://10.12.5.188:20003","id":"3"},{"projectName":"运营平台","projectCode":"omp","url":"http://10.12.7.111:6002","id":"123"}];
      // vm.$children[0].systemArr = systemArr
      resolve();
      // 应用自定义登录成功后，校验用户信息增加条件判断是否跳转
      // http.showError=false;
      // http.getMockFile('success.json').then((res)=>{
      //   resolve(res)
      // }).catch(err=>{
      //   reject(err)
      // })
    })
  },
  devReady(){
    var timeNow = (new Date()).toLocaleDateString();
    //打开日志文件
    var url = window.cordova.file.externalApplicationStorageDirectory;
    window.resolveLocalFileSystemURL(url, function (dirEntry) {
      const fileName = timeNow.replace(/\//g,"-")+".txt"
      dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
          appApi.logfileEntry = fileEntry;
      }, function(err) {
          console.log('onErrorCreateFile:' + err.toString());
      });
    }, function(err){
      console.log('onErrorLoadFs:'+err.toString());
    });
  }
}