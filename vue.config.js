/**
 * @author: wang.weili
 * @since : 2020/11/25
 * @doc.proxy: https://github.com/chimurai/http-proxy-middleware
 */
let ts = String(new Date().getTime())
module.exports = {
    publicPath: "/admin", // /android_asset/www
    //outputDir: "D://work/cordovaBuilder/www", // your cordova project directory
    productionSourceMap: false,
    transpileDependencies: ["crypto-js"], // fix android6 unexpected token =
    configureWebpack: config => {
        // 关闭代码压缩
        // config.optimization.minimize = false;
        // 删除注释\console.log
        if (process.env.NODE_ENV === "production") {
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ["console.log"];
            config.optimization.minimizer[0].options.terserOptions.output = {
                comments: false
            }
        }
        // 禁用缓存
        config.output.filename = process.env.NODE_ENV === 'production'?`js/[name].[contenthash:8].js?t=${ts}`:`js/[name].[hash:8].js?t=${ts}`
        config.output.chunkFilename = process.env.NODE_ENV === 'production'?`js/[name].[contenthash:8].js?t=${ts}`:`js/[name].[hash:8].js?t=${ts}`
    },
    pages: {
        index: {
            title: process.env.TITLE, // title
            entry: 'src/main.js'
        }
    },
    devServer: {
        proxy: Object.assign({
            '/user/*': {
                target: process.env.VUE_APP_USER=='mes'?'http://10.12.5.188:20003/':'http://10.12.7.111:6002/',
                ws: true,
                changeOrigin: true,
                // proxyTimeout: 60000,
                // onProxyReq: (proxyReq)=>{
                //     console.log(proxyReq.getHeader('host')+proxyReq.path)
                // }
            },
        },JSON.parse(process.env.PROXY))
    }
}