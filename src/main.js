/**
 * @author: wang.weili
 * @since : 2020/11/12
 * @description: 框架公共文件，慎重修改（优先修改app下项目定制文件）
 */
import Vue from 'vue'
import App from './App.vue'

import router from './routers'
import store from './store'
import http from './api'
import axios from 'axios'
import i18n from './i18n'
import './plugins/element.js'
import {deepClone,getImageBase64,generateRandom,validIp,checkParams} from './plugins/utils'
import './theme/index.css'; // 主题css，不动
import './assets/main.css'; // 框架css, 不动
import './app/assets/app.css'; // 应用css
import app from './app/main'; // 应用定制js
import {appConfig} from './app/config'

Vue.config.productionTip = false
Vue.prototype.$http = http;
Vue.prototype.$app = app; // 应用定制配置

let project,beforeHomeResult;
try {
    let session = JSON.parse(localStorage.getItem('aSession'));
    http.setToken(session.token)
    store.commit('setUser', session.user);
    if(process.env.VUE_APP_PROJECT_ONLY){
        project = JSON.parse(process.env.VUE_APP_PROJECT_ONLY)
    }else{
        project = JSON.parse(localStorage.getItem(`${process.env.VUE_APP_CODE}_Project`));
    }
    http.setProjectId(project.id);
    http.project = project;
} catch (e) {console.log(e)}

router.beforeEach(async(to, from, next) => {
    if(app.isMobile()){
        http.promptError = false;
        if(to.name=="home"||to.name=="login"){
            store.commit('setPageType',1);
        }else{
            store.commit('setPageType',2);
        }
    }else{
        store.commit('setPageType',0)
    }
    if(http.token && beforeHomeResult==undefined){
        await app.beforeHome(Vue.prototype).then(r=>{
            beforeHomeResult = true
        }).catch(e=>{
            console.error(e)
            beforeHomeResult = false
        })
    }
    if (to.meta.loginPass!=true && !(http.token && http.project.id && beforeHomeResult)){
        if(to.query&&to.query.redirect){
            next({ name: 'login' , query: { redirect: to.query.redirect }})
        }else{
            next({ name: 'login' , query: { redirect: to.fullPath }})
        }
    }else if (to.matched.length > 0) {
        next()
    } else {
        next('/404')
    }
})

if(appConfig.addNewTabMode==true)
router.afterEach( (to,from) => {
    if(to.params?.item=='add'||to.params?.item=='edit'||to.params?.item?.startsWith('{')){
        const endStr = to.params.item=='add'||to.params.item=='edit'?to.params.item:'edit';
        if(!to.matched[0].components.default.name.endsWith(endStr)){
            // console.log(endStr)
            // const cp = deepClone(to.matched[0].components.default)
            to.matched[0].components.default.name = to.name+endStr;
        }
        console.log(to.matched[0].components.default)
    }
})

router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    console.error("targetPath--",targetPath);
    if (isChunkLoadFailed) {
      alert("isChunkLoadFailed--",error.message)
      //router.replace(targetPath);
      location.reload();
    }
})

const appConfigDefault = {
    authCheck: true, // 全局菜单权限开关
    pageList: [10, 20, 50, 100, 200, 500],
    pageSize: 10,
    minQueryNum: 5,
    langOptions: [{label:"简体中文",value:"zh-CN"},{label:"English",value:"en-US"},{label:"Việt Nam",value:"vi-VN"}],
    requireRule: { required: true, message: 'L00001', trigger: 'blur' },
    pwdRule: {pattern:/^(?![A-Z0-9]+$)(?![a-zA-Z]+$)(?![a-z0-9]+$)(?![a-z&*%#@]+$)(?![A-Z&*%#@]+$)(?![0-9&*%#@]+$)[a-z0-9A-Z&*%#@]{8,}$/,message:'L00041',trigger:'blur'},// 所有特殊字符含中文：\W_
    hasBreadcrumb: true,
    hasTabs: false,
    addNewTabMode: false, // 新增、修改页添加新标签
    pwdPolicy: false, // 定期修改密码且浏览器不能记住密码（生产类系统，安全性要求较高），默认：false
    remPwd: false, // 前端人机校验，默认：false
    mbVersionPos: '', // 移动页面版本信息显示位置('',top,bottom)，默认top
    showSysLink: false,
    theme: 'default', // 默认主题
    themeSets:{
        filtergray:{
            // "--primary": "#545656",
            // "--primary-1": "#545656",
            // "--primary-bg": "#e4e4e4",
            // "--menucolorbg-highlight": "#545656",
            "--loginbox": 'url("../img/login_box_default.png")',
            "--tloginbg": 'url("../img/login_bg_gray.jpg")'
        },
        default:{
            "--loginbtn": `linear-gradient(
                to left,
                rgb(47, 99, 227),
                rgb(0, 255, 255)
              )`,
            "--tloginbg": 'url("../img/login_bg_default.jpg")',
            "--loginbox": 'url("../img/login_box_default.png")',
            "--loginboxmobile": 'url("../img/login_box_mobile.png")'
        },
        winter:{
            "--syslogo": `linear-gradient(
                to bottom,
                #065ecf,
                #a3c9fa
            )`,
            "--loginbtn": `linear-gradient(
                to left,
                #2f63e3,
                #2f63e3
              )`,
            "--tloginbg": 'url("../img/login_bg_winter.png")',
            "--loginbox": 'url("../img/login_box_winter.png")',
            "--loginboxmobile": 'url("../img/login_box_mobile_winter.png")',
            "--fontColorBox": "#444",
            "--fontColorError": "#F56C6C",
            "--bydlogo": 'url("../img/byd1.png")'
        }
    }
}
new Vue({
    router,
    store,
    i18n,
    data: Object.assign({
        packageName: process.env.VUE_APP_ID,
        salt: 'BYD',
        version: null,
        screenSize: document.documentElement.clientWidth + '*' + document.documentElement.clientHeight, // 屏幕宽高
        project: project, // 当前项目
        auth: [], // 用户所有权限菜单
        mobileList: [],
        menuList: [],
        pvList:[]
    },appConfigDefault,appConfig),
    methods: {
        deepClone,getImageBase64,generateRandom,validIp,checkParams,
        initSession(auth) {
            app.afterHome(this);
            this.initAuth(auth);
        },
        initAuth(auth) {
            // remove isMenu=false and add / for pages
            const getMenuItems = function(el) {
                    if (el.subs && el.subs.length && !el.subs.find(e => {return e.isMenu==true})) {
                        delete el.subs;
                        el.index = el.index.startsWith('/')||el.index.startsWith('http') ? el.index : '/' + el.index;
                        return el;
                    } else if (!(el.subs && el.subs.length) && el.isMenu !== false) {
                        el.index = el.index.startsWith('/')||el.index.startsWith('http') ? el.index : '/' + el.index;
                        return el;
                    } else {
                        if (el.subs && el.subs.length) {
                            el.subs = el.subs.filter(e => {
                                return e.isMenu == true
                            }).map(e => {
                                e = getMenuItems(e);
                                return e;
                            })
                        }
                        return el;
                    }
                }
            let webMenu = auth.find(el => el.index == this.menuRoot);
            let mbMenu = this.findMenuItem(`/${this.menuMobile}`,auth);
            let iconIds = [];
            if (webMenu && webMenu.subs) {
                iconIds = iconIds.concat(webMenu.subs.map(el=>el.id));
                this.getAuthLangs(webMenu);
                this.menuList = webMenu.subs.map(el => {
                    el.icon = el.icon || 'el-icon-tickets';
                    return getMenuItems(el)
                })
                this.menuList = this.menuList.map(el => {
                    if (el.subs && el.subs.length)
                        el.subs = el.subs.map(it => {
                            if (it.subs && it.subs.length) {
                                el.hasLever3 = true;
                            }
                            return it;
                        })
                    return el;
                })
            } else {
                this.menuList = [];
            }
            if (mbMenu && mbMenu.subs) {
                iconIds = iconIds.concat(mbMenu.subs.map(el=>el.id));
                this.getAuthLangs(mbMenu);
                this.mobileList = mbMenu.subs.map(el => {
                    el.icon = el.icon || 'el-icon-tickets';
                    return getMenuItems(el)
                })
            } else {
                this.mobileList = [];
            }
            if(iconIds.length)
            this.$http.axios.post('user/api/mesSysMenu/getByIds',{
                ids: iconIds
            },{
                headers:{'showError': false,'addLog': false}
            }).then(res=>{
                iconIds = res.DATA.filter(el=>el.iconAddress)
                this.menuList = this.menuList.map(el=>{
                    let imgEl = iconIds.find(e => e.id == el.id);
                    el.iconAddress = imgEl? imgEl.iconAddress : '';
                    return el;
                })
                this.mobileList = this.mobileList.map(el=>{
                    let imgEl = iconIds.find(e => e.id == el.id);
                    el.iconAddress = imgEl? imgEl.iconAddress : '';
                    return el;
                })
            })
        },
        clearSession() {
            this.$http.setToken("");
            this.auth = [];
            this.$http.project = {};
            localStorage.removeItem("aSession");
            localStorage.removeItem(`${process.env.VUE_APP_CODE}_Auth`);
        },
        handleLang(lang) {
            localStorage.setItem('locale', lang)
            this.$i18n.locale = lang;
            this.$http.setLangs(lang);
            // 切换语言后，刷新页面
            // this.$router.go(0);
        },
        /**
         * find the menu item with the param index in the list(mobileList or menuList or auth)
         * @param {String} index 
         * @param {Array} list 
         */
        findMenuItem(index, list) {
            let item = null;
            let findIt = function(el) {
                let idx = el.index.startsWith('/') ? el.index : '/' + el.index;
                if (idx == index) {
                    item = el;
                } else if (el.subs && el.subs.length) {
                    el.subs.forEach(it => {
                        findIt(it);
                    })
                }
            }
            list.forEach(el => {
                findIt(el);
            })
            return item;
        },
        getAuthLangs(menu) {
            let langSets = {
                en: {},
                zh: {}
            }
            langSets.zh[menu.index] = menu.menuName;
            langSets.en[menu.index] = menu.menuNameEn;
            const iteratorItem = function(el) {
                let idx = el.index.startsWith('/')||el.index.startsWith('http') ? el.index : '/' + el.index;
                langSets.zh[idx] = el.menuName;
                langSets.en[idx] = el.menuNameEn;
                if (el.subs && el.subs.length) {
                    el.subs.forEach(it => {
                        iteratorItem(it);
                    })
                }
            }
            menu.subs.forEach(el => {
                    langSets.zh[el.index] = el.menuName;
                    langSets.en[el.index] = el.menuNameEn;
                    if (el.subs && el.subs.length) {
                        el.subs.forEach(it => {
                            iteratorItem(it);
                        })
                    }
                })
                // 将菜单中英文更新至资源文件
            this.$i18n.mergeLocaleMessage('zh-CN', langSets.zh);
            this.$i18n.mergeLocaleMessage('en-US', langSets.en);
        },
        getMobileTitle(path) {
            let title = "";
            if (path) {
                let item = this.findMenuItem(path, this.mobileList);
                if (item)
                    title = this.$i18n.t(item.index)
            }
            if(this.mbVersionPos=='top')
            title += '_'+this.getAppVersion();
            return title
        },
        getMobileIndex(name) {
            let idx = 0;
            this.mobileList.forEach((item, index) => {
                if (item.subs && item.subs.length) {
                    let it = item.subs.find(el => el.index == "/" + name);
                    if (it) {
                        idx = index
                    }
                }
            })
            return idx;
        },
        closeKeyboard() {
            // 隐藏foucus事件自动弹出的键盘
            if (window.cordova) {
                setTimeout(function() {
                    window.cordova.plugins.Keyboard.close()
                });
            }
        },
        clearMsgBox() {
            let $els = document.querySelectorAll('.el-message--error');
            $els.forEach(el => {
                document.body.removeChild(el);
            })
        },
        /** 重设表格高度 */
        resizeTable(offset) {
            try {
                // 默认减去Tabs栏高度(46)||Breadcrumbs栏高度(38)+分页组件高度(32)+空白边距(5)=83
                offset = offset || 37;
                if(app.isMobile()){
                    offset -= 40
                }
                if(this.hasTabs){
                    offset += 46
                }
                if(this.hasBreadcrumb){
                    offset += 38
                }
                if(this.$route.query.showFrame=='false'){
                    offset -= 46
                }
                let $form = document.querySelector('.el-form');
                if ($form && $form.offsetHeight) {
                    offset += $form.offsetHeight
                }
                // ht为根据窗口高度计算表格所占高度
                let ht = document.querySelector('.el-main.el-scroll').offsetHeight - offset;
                // 最小表格高度120
                if (ht >= 120) {
                    let $tb = document.querySelector('.el-table');
                    let $tbFixed = document.querySelector('.el-table__fixed');
                    let $tbWrapper = document.querySelector('.el-table__fixed-body-wrapper');
                    $tb.style.height = ht + 'px';
                    $tbFixed.style.height = (ht - 1) + 'px';
                    $tbWrapper.style.height = (ht - 41) + 'px';
                }
            } catch (e) {
                console.log(e)
            }
        },
        /** 获取匹配的去参数路径,适用于非菜单页面 */
        getMatchedPath(route) {
            if (!route || !route.path || !route.matched) {
                return null;
            }
            let p = route.path.substring(1).split("/");
            if (p.length >= 2) {
                if (['add', 'edit', 'update', 'delete', 'scope', 'rule', 'copy'].includes(p[1]) || ["userDefined","list","item","frame"].includes(p[0])) {
                    if(p[0]=='item'){
                        p = `/${p[0]}/${p[1]}/${p[2]}`;
                    }else{
                        p = '/' + p[0] + '/' + p[1];
                    }
                } else if (p[1].startsWith('%7B')) {
                    p = '/' + p[0] + '/' + 'edit';
                } else if (p[1].startsWith('add')) {
                    p = '/' + p[0] + '/' + 'add';
                } else {
                    let idx = route.matched[0].path.indexOf(':');
                    p = idx > 0 ? route.matched[0].path.substring(0, idx - 1) : route.path;
                }
            } else {
                p = route.path;
            }
            return p;
        },
        copy(txt) {
            let $ipt = document.getElementById("copyIpt");
            $ipt.value = txt;
            $ipt.select();
            document.execCommand("Copy");
            this.$message({
                message: this.$t('L00046'),
                duration: 1500
            });
        },
        getNextSec(t) {
            try {
                t = new Date(t);
                t.setMinutes(t.getMinutes() - t.getTimezoneOffset(), t.getSeconds() + 1);
                return t.toJSON().replace('T', ' ').substring(0, 19);
            } catch (e) {
                return t
            }
        },
        getAppVersion(){
            if(!this.version){
                // if(window.cordova), 移动端从APP版本插件获取
                this.version=process.env.VUE_APP_VERSION
            }
            try{
                var br = process.env.VUE_APP_BUILD.split('_')
                return `${br[0]}-${this.version}.${br[1]}-${br[2]}`
            }catch(e){console.error(e)}
            return `${process.env.VUE_APP_BUILD}-${this.version}`
        },
        getMac(){
            if(window.cordova){
                window.MacAddress.getMacAddress((macAddress)=>{
                    this.$http.macAddress = macAddress.toUpperCase();
                },(fail)=>{alert(fail);});
            }
        },
        getTheme(){
            // 根据theme配置更新主题变量值
            this.$http.axios.post('user/exi/loginSource/getLoginSource',null,{
                headers: {
                    'showError': false,
                    'addLog': false,
                    token:''
                }
            }).then(res=>{
                if(res.DATA.resource&&res.DATA.resource.length){
                    let imgUrl = res.DATA.resource.find(el=>el.code=='bydlogo')?.url;
                    axios.create().get(imgUrl,{
                        timeout: 3000
                    }).then(()=>{
                        let themeSet = {}
                        if(res.DATA&&res.DATA.name)
                        this.$root.theme = res.DATA.name;
                        if(this.$root.theme&&this.$root.themeSets[this.$root.theme]){
                            themeSet = this.$root.themeSets[this.$root.theme];
                        }
                        if(res.DATA.resource)
                        res.DATA.resource.forEach(el=>{
                            themeSet['--'+el.code] = `url("${el.url}")`;
                        })
                        if(res.DATA.fonts)
                        res.DATA.fonts.forEach(el=>{
                            themeSet['--'+el.code] = el.value;
                        })
                        for(let k in themeSet){
                            document.body.style.setProperty(k,themeSet[k]);
                        }
                    }).catch(()=>{
                        this.setDefaultTheme()
                    })
                }else{
                    this.setDefaultTheme()
                }
            }).catch(()=>{
                this.setDefaultTheme()
            })
        },
        setDefaultTheme(){
            if(this.$root.theme&&this.$root.themeSets[this.$root.theme]){
                let themeSet = this.$root.themeSets[this.$root.theme];
                for(let k in themeSet){
                    document.body.style.setProperty(k,themeSet[k]);
                }
            }
        }
    },
    render: h => h(App)
}).$mount('#app')