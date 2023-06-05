/**
 * @author: wang.weili
 * @since : 2020/11/25
 * @doc.proxy: https://github.com/chimurai/http-proxy-middleware
 */

process.env.VUE_APP_DEV = "http://10.12.5.188:20003/"
process.env.VUE_APP_PRO = "http://10.12.5.188:20008/"
process.env.VUE_APP_LOCAL = "http://127.0.0.1:10020/"
process.env.VUE_APP_LOG = "http://10.12.4.223:10099/"

process.env.VUE_APP_CODE = "BYD_FLAMES"
process.env.VUE_APP_PRE_URL = "mes/api/"
process.env.VUE_APP_MENU_ROOT = "web"

process.env.VUE_APP_MENU_MOBILE = "pda"
process.env.VUE_APP_ID = "com.byd.flames"
process.env.VUE_APP_VERSION = "1.0.0"
process.env.VUE_APP_BUILD = "Flames-M_builds_versionDate"
// process.env.VUE_APP_PROJECT_ONLY = '{"id":3,"projectName":"Zatanna","projectCode":""}' // 唯一项目，如果配置VUE_APP_PROJECT_ONLY，登录页不显示项目下拉框
process.env.VUE_APP_HOME = "/" // 登录后主页路径，默认: /, 客户端配置：/config

module.exports = {
    publicPath: "/admin", // /android_asset/www
    //outputDir: "D://work/cordovaBuilder/www", // your cordova project directory
    productionSourceMap: false,
    transpileDependencies: ["crypto-js"], // fix android6 unexpected token =
    // configureWebpack: config => {
    //     // 关闭代码压缩
    //     config.optimization.minimize = false;
    // },
    pages: {
        index: {
            title: "ADMIN", // title
            entry: 'src/main.js'
        }
    },
    devServer: {
        proxy: {
            '/user/*': {
                target: process.env.VUE_APP_DEV,
                ws: true,
                changeOrigin: true,
                // proxyTimeout: 60000,
                // onProxyReq: (proxyReq)=>{
                //     console.log(proxyReq.getHeader('host')+proxyReq.path)
                // }
            },
            '/zatanna/log/*': {
                target: process.env.VUE_APP_LOG,
                changeOrigin: true,
                pathRewrite: {
                    "^/zatanna": '/'
                },
                onProxyReq: (proxyReq)=>{
                    console.log(proxyReq.getHeader('host')+proxyReq.path)
                }
            },
            '/zatanna//*': {
                target: process.env.VUE_APP_DEV,
                changeOrigin: true
            },
            // '/zatanna//*': {
            //     target: process.env.VUE_APP_LOCAL,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/zatanna": '/'
            //     }
            // }
        }
    }
}