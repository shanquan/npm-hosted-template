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
 * | keepAlive | 默认值this.$root.hasTabs  |  页面缓存 | 统一规范：“Tab多标签导航页面，在切换Tab页面时，表格列表页面需缓存查询条件，关闭Tab页面时需自动清缓存；hasBreadcrumb面包屑导航模式，所有页面不缓存”。hasTabs=false(hasBreadcrumb=true)时,keepAlive设置无效;当hasTabs=true时，默认值keepAlive=true，可设置keepAlive=false取消页面缓存 |
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import app from '../app/main'

Vue.use(Router)
let routers = [];
// 编辑组件及路由
let itemRoutes=[];
// 自动导入Item.*.vue路由，改写组件name
const importComs = function(obj,file){
    const deepClone = function(source, hash = new WeakMap()){
        if(typeof source != 'object'|| !source) return source;
        if(hash.has(source)) return hash.get(source)
        const target = Array.isArray(source) ? [] : {};
        hash.set(source, target);
        for( let key in source){
          if(Object.prototype.hasOwnProperty.call(source, key)){
          target[key] = deepClone(source[key], hash)
        }
      }
      return target;
    }
    const arr = file.split('/')
    let fn = arr[arr.length-2]
    const fn1 = arr[arr.length-1].substring(5,arr[arr.length-1].length-4)
    fn = fn1!='.'?fn1:fn
    const itemAdd = obj
    itemAdd.name = `${fn}Add`
    const itemEdit = deepClone(obj)
    itemEdit.name = `${fn}Edit`
    const itemDetail = deepClone(obj)
    itemDetail.name = `${fn}Detail`
    itemRoutes.push({
        path: `/${fn}/add`,
        name: itemAdd.name,
        component: itemAdd
    },{
        path: `/${fn}/edit/:id`,
        name: itemEdit.name,
        component: itemEdit
    },{
        path: `/${fn}/detail/:id`,
        name: itemDetail.name,
        component: itemDetail
    })
}
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
    const itemFiles = require.context("@/views/", true, /Item.*\.vue$/);
    itemFiles.keys().forEach((file) => {
        const obj = itemFiles(file).default;
        if (obj){
            importComs(obj,file)
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
        }, {
            path: '/frame/:url',
            name: 'frame',
            component: () => import ( /* webpackChunkName: "" */ '../views/Frame.vue')
        }
    ].concat(routers,itemRoutes,app.routers)
})