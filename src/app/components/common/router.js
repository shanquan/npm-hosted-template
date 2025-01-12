/**
 * @author wang.weili
 * @since 2024/03/19
 */
let itemRoutes=[];
// 自动导入Item.vue组件创建路由
const importComs = function(obj){
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
  let itemAdd,itemEdit,itemDetail
  const fn = 'common'
  itemAdd = obj
  itemAdd.name = `${fn}Add`
  itemEdit = deepClone(obj)
  itemEdit.name = `${fn}Edit`
  itemDetail = deepClone(obj)
  itemDetail.name = `${fn}Detail`
  itemRoutes.push({
      path: `/item/:model/add`,
      name: itemAdd.name,
      component: itemAdd
  },{
      path: `/item/:model/edit/:id`,
      name: itemEdit.name,
      component: itemEdit
  },{
      path: `/item/:model/detail/:id`,
      name: itemDetail.name,
      component: itemDetail
  })
}
try{
  const itemFiles = require.context("./", false, /Item.vue$/);
  itemFiles.keys().forEach((file) => {
      const obj = itemFiles(file).default;
      if (obj){
          importComs(obj)
      }
  });
}catch(e){console.log(e)}
const router = [{
  path: '/list/:model',
  name: 'commonlist',
  component: () =>
      import ( /* webpackChunkName: "common" */ './List.vue')
}].concat(itemRoutes)

export default {router}