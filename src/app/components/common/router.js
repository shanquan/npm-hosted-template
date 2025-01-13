/**
 * @author wang.weili
 * @since 2024/03/19
 */
let itemRoutes=[];
// 自动导入Item.vue组件创建路由，异步加载组件后修改name
const importComs = function(){
  const fn = 'common'
  const fp = './Item.vue'
  itemRoutes.push({
      path: `/item/:model/add`,
      name: `${fn}Add`,
      component: async()=>{
        const obj = await import(`${fp}`)
        obj.name = `${fn}Add`
        return obj
      }
  },{
      path: `/item/:model/edit/:id`,
      name: `${fn}Edit`,
      component: async()=>{
        const obj = await import(`${fp}`)
        obj.name = `${fn}Edit`
        return obj
    }
  },{
      path: `/item/:model/detail/:id`,
      name: `${fn}Detail`,
      component: async()=>{
          const obj = await import(`${fp}`)
          obj.name = `${fn}Detail`
          return obj
      }
  })
}
importComs()
const router = [{
  path: '/list/:model',
  name: 'commonlist',
  component: () =>
      import ( /* webpackChunkName: "common" */ './List.vue')
}].concat(itemRoutes)

export default {router}