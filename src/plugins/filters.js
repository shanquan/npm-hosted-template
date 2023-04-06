export default {
  install (Vue) {
    Vue.filter('fixed2', function(value) {
      if (!value && value != 0) return ''
      return value.toFixed(2)
    })
  }
}