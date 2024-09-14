/**
 * @author: wang.weili
 * @since : 2020/11/26
 * @description: 建议router.page.js和page.vue放在同一文件夹下（示例：views/sys/mesSysObject），便于迁移复制，减少合并冲突
 * router.meta配置说明： 
 * | 名称 | 默认值 | 说明 | 示例页面 |
 * | ------ | ------ | ------ | ------ |
 * | loginPass | true | 免登录 | /resetPwd |
 * | authPass | true |  免菜单权限 | /config |
 * | showFrame | false | 隐藏默认menu和header，全局支持URL传参配置?showFrame=false（链接跳转无法保持），如需保持URL传参同时传递keep参数：?showFrame=false&keep=true | /404 | 
 * | blank | true |  新窗口打开 | /mesSysProjects |
 * | keepAlive | false |  页面缓存 | /publicCombination |
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import app from '../app/main'

Vue.use(Router)
let routers = [];
// 自动合并routers下所有router.xx.js（公共）和views下所有router.xx.js（页面）
try{
    const files = require.context("./", false, /^\.\/router.*\.js$/);
    const viewFiles = require.context("@/views/", true, /router.*\.js$/);
    files.keys().forEach((file) => {
        const obj = files(file).default;
        if (obj){
            routers.push(...obj.router);
        }
    });
    viewFiles.keys().forEach((file) => {
        // console.log(file)
        const obj = viewFiles(file).default;
        if (obj){
            routers.push(...obj.router);
        }
    });
}catch(e){console.log(e)}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/', // support querys for mobile: ?index=0
            name: 'home',
            meta: { authPass: true },
            component: Home
        }, {
            path: '/index.html', // support cordova apps
            redirect: '/'
        }, {
            path: '/login',
            name: 'login',
            meta: { loginPass: true, authPass: true},
            component: Login
        }, {
            path: '/404',
            name: '404',
            meta: { authPass: true, showFrame: false },
            component: () =>
                import ('../views/404.vue')
        }, {
            path: '/403',
            name: '403',
            meta: { authPass: true },
            component: () =>
                import ('../views/403.vue')
        }, {
            path: '/resetPwd',
            name: 'resetPwd',
            meta: { loginPass: true, authPass: true},
            component: () =>
                import ('../views/resetPwd.vue')
        }
    ].concat(routers,app.routers)
})