/**
 * @author: wang.weili
 * @since : 2022/02/26
 * @description: 本文件为框架基础文件之一，慎重修改
 */
import {applang} from '../app/config'
import app from '../app/main'

let langs = {};
Object.assign(langs,app.langs)

// 自动合并langs下所有zh-CN.xx.js（公共）和views下所有zh-CN.xx.js（页面）
try{
    const files = require.context("./", false, /^\.\/zh-CN.*\.js$/);
    const viewFiles = require.context("@/views/", true, /zh-CN.*\.js$/);
    files.keys().forEach((file) => {
      const obj = files(file).default;
      if (obj){
        Object.assign(langs, obj)
      }
    });
    viewFiles.keys().forEach((file) => {
      // console.log(file)
      const obj = viewFiles(file).default;
      if (obj){
        Object.assign(langs, obj)
      }
    });
  
  // 合并系统定制翻译字段
  Object.assign(langs, applang)
}catch(e){}
export default langs