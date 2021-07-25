
const webpack = require('webpack')

module.exports = {
    
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
           
           
            // 设置打包入口
            config.entry('app').clear().add('./src/main-prod.js')
            // 设置无需打包 从 window 全局引入的对象
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                vuex: 'Vuex',
                axios: 'axios',
            })
            // 设置首页内容
            // config.plugin('html').tap(args => {
                
            //     args[0].isProd = true
            //     console.log(args[0].isProd)
            //     return args
            // })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
        // config.plugin('html').tap(args => {
        //     args[0].isProd = false
        //     console.log(args[0].isProd)
        //     return args
        // })
    },
    configureWebpack: () => {
        return {
            plugins: [
                new webpack.BannerPlugin('最终版权归 youngFuns 所有')
            ],
    }
          
    }
}