/**
 * @author: wang.weili
 * @since : 2023/2/21
 * @description: 项目定制全局数据及公共方法,directives,filters
 */
import Vue from 'vue'
import directives from './directives';
import filters from './filters';
import commonRouter from '@/app/components/common/router'
import sysRouter from 'user-sys/router.sys'
import sysLang from 'user-sys/zh-CN.sys'

/**
 * global components
 */
/**
 * global filters
 */
Vue.use(directives);
Vue.use(filters);

/**
 * global data, cache or localstorage
 * @example const globalSet = true;
 */
export default {
  routers: [].concat(sysRouter.router,commonRouter.router),
  langs:{...sysLang},
  eventBus:new Vue({}),
  getBuffer(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  },
  isMobile() {
      // for ipad: /macintosh|mac os x/i.test(navigator.userAgent)
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.screen.height > window.screen.width && window.screen.width < 768;
  },
  mobileClass(){
    if(/Android|Chrome|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    return 'android'
    if(/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent))
    return 'ios'
    return ''
  },
  devReady(){
    // 应用cordova插件方法
  },
  /**
   * 影响登录页跳转的条件判断
   * @param {*} vm 
   * @returns Promise.reject可阻止页面跳转，继续停留登录页
   */
  beforeHome(vm){
    // console.log(vm.$store.state.user)
    return new Promise((resolve,reject)=>{
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
  /**
   * 登录后执行
   * @param {*} vm 
   */
  afterHome(vm){
    vm.$root.$children[0].systemArr = [vm.$http.project]
    vm.$children[0].systemCode = vm.$http.project.id;
    // 接口获取systemArr，作为框架公共数据，直接放入main.js的initSession函数中也可以，这里仅做示例如何添加应用定制获取数据示例代码
    if(process.env.VUE_APP_SYSTEMS){
      try{
        const systemArr = JSON.parse(process.env.VUE_APP_SYSTEMS)
        vm.$root.$children[0].systemArr = vm.$root.$children[0].systemArr.concat(systemArr)
      }catch (e) {console.error(e)}
    }
    // if(applang[vm.$http.project.projectCode]&&applang[vm.$http.project.projectCode][vm.$i18n.locale]){
    //     vm.$i18n.mergeLocaleMessage(vm.$i18n.locale, applang[vm.$http.project.projectCode][vm.$i18n.locale]);
    // }
    vm.$http.axios.post('api/me/mesSysConfig/config?name=LOG_URL',null,{
      headers:{
        showError: false
      }
    }).then(res=>{
      if(res.DATA){
        let url = res.DATA
        url = url.endsWith('/')?url:url+'/';
        vm.$http.log_url = url
      }
      vm.$app.eventBus.$emit('getLogUrl',vm.$http.log_url)
    })
    vm.$http.axios.post('exi/me/sys/version',null,{
      headers:{
        showError: false
      }
    }).then(res=>{
      vm.$children[0].appVersion = vm.getAppVersion()+'_'+res.DATA
    })
  }
}