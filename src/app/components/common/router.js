/**
 * @author wang.weili
 * @since 2024/03/19
 */

const router = [{
  path: '/list/:model',
  name: 'commonlist',
  meta: {keepAlive: true},
  component: () =>
      import ( /* webpackChunkName: "common" */ './List.vue')
}, {
  path: '/item/:model/add',
  name: 'itemAdd',
  meta: {keepAlive: true},
  component: () =>
      import ( /* webpackChunkName: "common" */ './ItemAdd.vue')
}, {
  path: '/item/:model/edit/:id',
  name: 'itemEdit',
  meta: {keepAlive: true},
  component: () =>
      import ( /* webpackChunkName: "common" */ './ItemEdit.vue')
}, {
  path: '/item/:model/detail/:id',
  name: 'itemDetail',
  component: () =>
      import ( /* webpackChunkName: "common" */ './ItemDetail.vue')
}]

export default {router}