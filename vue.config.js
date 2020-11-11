module.exports = {
    devServer: {
        port: 8888,
        host: "localhost",
        https: false,
        open: true, //启动服务时，自动打开浏览器访问
        // 开发环境代理配置
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                // 目标服务器地址,代理访问
                target: process.env.VUE_APP_SERVICE_URL,
                changeOrigin: true, //开启代理服务器
                pathRewrite: {
                    // '^/dev-api': '',
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                }
            }
        }
    },

    lintOnSave: false,
    productionSourceMap: false,
}