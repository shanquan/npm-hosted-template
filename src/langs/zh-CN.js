/**
 * @author: wang.weili
 * @since : 2022/02/26
 * @description: 本文件为框架基础文件之一，慎重修改
 */
import applang from './app'
import app from '../app/main'

let langs = {};
Object.assign(langs,app.langs)

// 自动合并langs下所有zh-CN.xx.js（公共）和views下所有zh-CN.xx.js（页面）
try{
  const files = import.meta.globEager("./zh-CN.*.js");
  const viewFiles = import.meta.globEager("@/views/**/zh-CN.*.js");
  for (const path in files) {
    const obj = files[path].default;
    if (obj){
      Object.assign(langs, obj)
    }
  }
  for (const path in viewFiles) {
    const obj = viewFiles[path].default;
    if (obj){
      Object.assign(langs, obj)
    }
  }
  // 合并系统定制翻译字段
  Object.assign(langs, applang[process.env.VUE_APP_CODE])
}catch(e){
  console.log(e)
}
export default langs