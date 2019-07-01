const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');


const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: 'body',
    excludeChunks: ['base'],
    minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
    }
});

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: __dirname + '/dist/',
        filename: '[name].[chunkhash].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.(sass|scss)$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.css$/,
                loader: [
                    'style-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/',
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                loader: 'svg-react-loader',
                query: {
                    classIdPrefix: '[name]-[hash:8]__',
                    filters: [
                        function (value) {
                            // this.update(newvalue);
                        }
                    ],
                    propsMap: {
                        fillRule: 'fill-rule',
                        foo: 'bar'
                    },
                    xmlnsTest: /^xmlns.*$/
                }

            }
        ]
    },
    plugins: [
        HtmlWebpackPluginConfig,
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash].js',
            minChunks(module) {
                return module.context &&
                    module.context.indexOf('node_modules') >= 0;
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script',
            include: 'allChunks',
            fileBlacklist: [/\.(css|map)$/, /base?.+/]
        })
        // ,
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     Popper: ['popper.js', 'default'],
        // }),
    ],
    
}