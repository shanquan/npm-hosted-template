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
      // 扫描输入，禁用键盘(指令实现)
      // @usage: <el-input v-scan />
      Vue.directive('scan', {
        inserted (el) {
          const ipt = el.querySelector('input')
          ipt.addEventListener('focus', () => {
              ipt.setAttribute('readonly','readonly')
              ipt.setAttribute('v-scan','')
              setTimeout(() => {
                ipt.removeAttribute('readonly');
                ipt.removeAttribute('v-scan')
              },200)
          })
          ipt.addEventListener('click',()=>{
            if(ipt.hasAttribute('v-scan')&&!el.classList.contains('el-select'))
            ipt.removeAttribute('readonly')
          })
        }
      })
    }
  }