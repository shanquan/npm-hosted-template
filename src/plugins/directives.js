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
    }
  }