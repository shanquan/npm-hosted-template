/**
 * @author: wang.weili
 * @since : 2020/11/12
 * @description: 框架公共文件，慎重修改（优先使用app.js项目定制文件做存储global data）
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    menuCollapse: false,
    pageType: 0, // 0: web menu&page 1: mobile menu 2: mobile page
    user: {}
  },
  mutations: {
    changeMenu(state,value) {
      if(value===undefined){
        state.menuCollapse = !state.menuCollapse;
      }else{
        state.menuCollapse = value
      }
    },
    setUser(state,user){
      Object.assign(state.user,user);
    },
    setPageType(state,type){
      state.pageType = type;
    }
  }
})
