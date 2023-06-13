/**
 * @author wang.weili
 * @since : 2023/06/13
 * @description: app filters
 */
export default {
  install (Vue) {
    Vue.filter('fixed2', function(value) {
      if (!value && value != 0) return ''
      return value.toFixed(2)
    })
    Vue.filter('capitalize', function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    })
  }
}