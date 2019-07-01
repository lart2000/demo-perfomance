
 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');
 
 module.exports = merge(common, {
    devtool: 'cheap-module-source-map',
    devServer: {
        port: 8080,
        historyApiFallback: true,
        compress: true,
        watchContentBase: true,
        watchOptions: {
            poll: true
        },
    }
   
 });
