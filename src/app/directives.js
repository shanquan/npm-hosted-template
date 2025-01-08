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
            ipt.removeAttribute('inputmode')
          })
        }
      })
      /**
       * 如浏览器不支持inputmode，可以使用readonly实现
       * readonly属性与el-select filter组件冲突无效(示例：`WMS3.0`出库管理-特殊发料`/wmsSpecialNeedSendMaterials`)，因组件自身会改变readonly属性导致v-scan指令失效，需要通过`this.$root.closeKeyboard();`手动关闭虚拟键盘，并且只在运行打包好的apk时生效
       */
      Vue.directive('scan0', {
        inserted (el) {
          const ipt = el.querySelector('input')
          ipt.setAttribute('v-scan','')
          ipt.addEventListener('focus', () => {
              ipt.setAttribute('readonly','readonly')
              setTimeout(() => {
                ipt.removeAttribute('readonly');
              },200)
          })
          ipt.addEventListener('click',()=>{
            ipt.removeAttribute('readonly')
          })
        }
      })
    }
  }