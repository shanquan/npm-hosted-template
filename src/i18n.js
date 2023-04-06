/**
 * @author: wang.weili
 * @since : 2020/12/09
 * @source: https://www.cnblogs.com/rogerwu/p/7744476.html
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './langs/zh-CN'
import en from './langs/en-US'
import vi from './langs/vi-VN'
import enLocale from 'element-ui/lib/locale/lang/en'
import viLocale from 'element-ui/lib/locale/lang/vi'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
  "en-US": Object.assign(en, enLocale),
  "zh-CN": Object.assign(zh, zhLocale),
  "vi-VN": Object.assign(vi, viLocale)
}

let lan = navigator.systemLanguage || navigator.language;

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || lan,
  messages
})

export default i18n