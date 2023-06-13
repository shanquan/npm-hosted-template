/**
 * APP 路由配置
 * @author wang.weili
 * @since 2022-03-26
 */

const router = [{
    path: '/config',
    name: 'config',
    meta: { authPass: true },
    component: () =>
    import ( /* webpackChunkName: "app" */ '../views/Config.vue')
}]

export default {router}