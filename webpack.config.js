/*
 * @Description:
 * @Autor: Liou
 * @Date: 2021-09-21 13:34:49
 * @LastEditors: Liou
 * @LastEditTime: 2021-09-25 14:57:22
 */
console.log('-----------------------');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: "index.js",
        path: __dirname + "/dist"//这里必须是绝对路径
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
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: 'img/[name][hash:6].[ext]',
                            limit: 100 * 1024 //小于100kb的文件被转成base64编码，大于100kb的文件保存在静态文件夹
                        }
                    }
                ]
            }
        ]
    }
}