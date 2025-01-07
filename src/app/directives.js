/**
 * @author wang.weili
 * @since : 2023/06/13
 * @description: app directives
 */
export default {
    install (Vue) {
      // 防重复点击(指令实现)
      Vue.directive('preventReClick', {
        inserted (el, binding) {
          el.addEventListener('click', () => {
            if (!el.disabled) {
              el.disabled = true;
              el.classList.add('is-disabled');
              setTimeout(() => {
                el.disabled = false;
                el.classList.remove('is-disabled');
              }, binding.value || 800)
            }
          })
        }
      })
      /**
       * 扫描输入，禁用键盘inputmode(指令实现)
       * readonly属性也能实现，不过与el-select filter指令冲突无效
       * @usage: <el-input v-scan />
       */
      Vue.directive('scan', {
        inserted (el) {
          const ipt = el.querySelector('input')
          ipt.setAttribute('v-scan','')
          ipt.addEventListener('focus', () => {
            ipt.setAttribute('inputmode','none')
          })
          ipt.addEventListener('click',()=>{
            if(ipt.hasAttribute('v-scan'))
            ipt.removeAttribute('inputmode')
          })
        }
      })
    }
  }