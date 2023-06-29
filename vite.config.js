/**
 * @author: wang.weili
 * @since : 2023/06/14
 */
import path from 'path'
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createHtmlPlugin } from 'vite-plugin-html'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import { viteCommonjs,esbuildCommonjs } from '@originjs/vite-plugin-commonjs'



process.env.VUE_APP_DEV = "http://10.12.5.188:20003/"
process.env.VUE_APP_LOCAL = "http://127.0.0.1:10020/"
process.env.BASE_URL = "/admin" // vue-cli自动添加

process.env.VUE_APP_CODE = "BYD_FLAMES"
process.env.VUE_APP_PROJECT_ONLY = '{"id":3,"projectName":"Zatanna","projectCode":""}' // 唯一项目，如果配置VUE_APP_PROJECT_ONLY，登录页不显示项目下拉框
process.env.VUE_APP_ID = "com.byd.flames"
process.env.VUE_APP_VERSION = "1.0.0"
process.env.VUE_APP_BUILD = "Flames-M_builds_versionDate"

process.env.VUE_APP_CUSTOMIZE = "CUSTOMIZED" // jenkins发布定制系统配置标识
let config = {
    title: "ADMIN"
}
if(config[process.env.VUE_APP_CUSTOMIZE]){
    Object.assign(config,config[process.env.VUE_APP_CUSTOMIZE])
    delete config[process.env.VUE_APP_CUSTOMIZE]
}

export default (mode) => {
    return defineConfig({
        base: process.env.BASE_URL,
        build:{
            outDir: 'dist',
            sourcemap: false
        },
        plugins: [
            viteCommonjs(),
            createVuePlugin(),
            createHtmlPlugin({
                minify: true,
                template: 'public/index.html',
                inject: {
                    data: {
                        htmlWebpackPlugin:{
                            options: {
                                title: config.title,
                            }
                        }
                    }
                }
            }),
            ViteRequireContext(),
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
        optimizeDeps:{
            include:['@riophae/vue-treeselect','user-sys'],
            esbuildOptions:{
              plugins:[
                esbuildCommonjs(['@riophae/vue-treeselect'])
              ]
            }
        },
        server: {
            port: 8080,
            proxy: {
                '/user/': {
                    target: process.env.VUE_APP_DEV,
                    ws: true,
                    changeOrigin: true,
                    onProxyReq: (proxyReq)=>{
                        console.log(proxyReq.getHeader('host')+proxyReq.path)
                    }
                },
                '/zatanna/': {
                    target: process.env.VUE_APP_DEV,
                    changeOrigin: true,
                },
            }
        }
   })
}