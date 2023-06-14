/**
 * @author: wang.weili
 * @since : 2023/06/14
 */
import path from 'path'
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createHtmlPlugin } from 'vite-plugin-html'

process.env.VUE_APP_DEV = "http://10.12.5.188:20003/"
process.env.VUE_APP_PRO = "http://10.12.5.188:20008/"
process.env.VUE_APP_LOCAL = "http://127.0.0.1:10020/"

process.env.VUE_APP_CODE = "BYD_FLAMES"
process.env.VUE_APP_MENU_ROOT = "web"

process.env.VUE_APP_MENU_MOBILE = "pda"
process.env.VUE_APP_ID = "com.byd.flames"
process.env.VUE_APP_VERSION = "1.0.0"
process.env.VUE_APP_BUILD = "Flames-M_builds_versionDate"
// process.env.VUE_APP_PROJECT_ONLY = '{"id":3,"projectName":"Zatanna","projectCode":""}' // 唯一项目，如果配置VUE_APP_PROJECT_ONLY，登录页不显示项目下拉框
process.env.VUE_APP_HOME = "/" // 登录后主页路径，默认: /, 客户端配置：/config
process.env.BASE_URL = "/admin"

export default (mode) => {
    return defineConfig({
        base: process.env.BASE_URL,
        build:{
            outDir: 'dist',
            sourcemap: false
        },
        plugins: [
            createVuePlugin(),
            createHtmlPlugin({
                minify: true,
                template: 'public/index.html',
                inject: {
                    data: {
                        htmlWebpackPlugin:{
                            options: {
                                title: 'ADMIN',
                            }
                        }
                    }
                }
            }),
        ],
        define: {
            'process.env': process.env
        },
        resolve: {
            extensions: ['.js', '.vue', '.json', '.less'],  
            alias: {
              vue: 'vue/dist/vue.esm.js',
              '@': path.join(__dirname, 'src'),
              '~': path.join(__dirname, 'node_modules'),
            }
        },
        server: {
            port: 8080,
            proxy: {
                '/user/': {
                    target: process.env.VUE_APP_DEV,
                    ws: true,
                    changeOrigin: true,
                    // proxyTimeout: 60000,
                    // onProxyReq: (proxyReq)=>{
                    //     console.log(proxyReq.getHeader('host')+proxyReq.path)
                    // }
                },
                '/zatanna/': {
                    target: process.env.VUE_APP_DEV,
                    changeOrigin: true,
                },
            }
        }
   })
}