/**
 * @author wang.weili
 * @since 2023/02/28
 * @description 系统/项目自定义翻译字段，支持覆盖同名框架基础字段
 * 1. 系统覆盖默认框架字段，通过vue.config.js中的process.env.VUE_APP_CODE，打包时匹配
 * 2. 项目覆盖默认框架字段，main.js中initSession通过项目代码匹配，示例：Home.vue L10221
 * 
 */
export default {
    BYD_FLAMES: {
        // 项目自定义字段，选择项目后再合并覆盖默认字段
        zatanna: {
            L10221: 'zatanna试制工厂'
        }
    },
    BYD_PLM: {
        // 系统覆盖默认框架字段，适用登录页，项目未选择
        L10206: '电子事业群产品生命周期管理系统',
        L10051: 'Electronics Product Lifecycle Management',
        L10052: '测试环境',
        L10053: 'EPLM',
    }
}