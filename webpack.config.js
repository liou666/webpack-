/*
 * @Description:
 * @Autor: Liou
 * @Date: 2021-09-21 13:34:49
 * @LastEditors: Liou
 * @LastEditTime: 2021-09-25 16:51:00
 */
console.log('-----------------------');
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack")//定义全局变量
const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
    entry: './src/index.js',
    output: {
        filename: "js/index.js",
        path: __dirname + "/dist",//这里必须是绝对路径，
        // assetModuleFilename: 'images/[name].[hash:6][ext]'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, less-loader}
                        }
                    },
                    {
                        loader: 'postcss-loader',//加浏览器前缀
                        options: {
                            postcssOptions: {
                                plugins: ['postcss-preset-env']//依赖的插件
                            }
                        }//从右向左执行
                    },

                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',//加浏览器前缀
                        options: {
                            postcssOptions: {
                                plugins: ['postcss-preset-env']//依赖的插件
                            }
                        }//从右向左执行
                    },]//从右向左执行
            },
            {
                test: /\.jpg$/,
                // use: [
                //     {
                //         loader: "url-loader",
                //         options: {
                //             name: 'img/[name][hash:6].[ext]',
                //             limit: 100 * 1024 //小于100kb的文件被转成base64编码，大于100kb的文件保存在静态文件夹
                //         }
                //     }
                // ]

                //相当于file-loader webpack5内置
                // type: "asset/resource",
                // 

                //相当于url-loader webpack5内置
                // type: "asset/inline",

                type: 'asset',//webpack 将按照默认条件，自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型。
                generator: {
                    filename: 'images/[name].[hash:6][ext]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4kb 表示大于4kb使用 resource，否则使用inline
                    }
                }

            },

            {
                test: /\.ttf/i,
                generator: {
                    filename: 'font/[name].[hash:6][ext]'
                }
            }
        ]
    },
    //配置插件
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "liou webpack",
            template: "./public/index.html",
            // filename: "1.html"
        }),
        new DefinePlugin({
            BASE_URL: "'./'"
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "public",
                    globOptions: {
                        ignore: ['**/index.html', '**/1.js']
                    }
                }
            ]
        })
    ]
}