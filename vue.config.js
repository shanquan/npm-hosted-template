/**
 * @author: wang.weili
 * @since : 2020/11/25
 * @doc.proxy: https://github.com/chimurai/http-proxy-middleware
 */

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
            title: process.env.TITLE, // title
            entry: 'src/main.js'
        }
    },
    devServer: {
        proxy: Object.assign({
            '/user/*': {
                target: "http://10.12.5.188:20003/",
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