## webpack学习记录



>webpack执行依赖于webpack-cli

- 执行`webpack`命令，默认从`./src/index.js`进行打包，默认输出位置为`./dist`文件夹。
也可以通过指令`webpack --entry ./src/index.js --output-path build`更改打包入口和输出路径。
- 开发中一般不会直接去在终端中这样用，通常会把配置统一放在`webpack.config.js`文件中。执行`webpack`进行打包的时候默认会先走`webpack.config.js`配置文件，可以通过`webpack --config ./myconfig.js`命令指定默认配置文件


### loader使用

>webpack 不能直接处理样式或者图片等文件需要借助loader完成。

loader的使用有两种方式：
1. 配置方式（推荐）：在 `webpack.config.js` 文件中指定 `loader`。**module.rules**
    ```js
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']//从右向左执行
            }
        ]
    }
     ```
2. 内联方式：在每个 `import` 语句中显式指定 `loader`，需要用！隔开 `例如：import "css-loader!./css/index.css"`

#### 样式loader
|  loader   | 作用  |
|  ----  | ----  |
| postcss-loader  | 将css增加浏览器前缀 （配合插件postcss-preset-env使用）|
| less-loader  | 处理less文件 需同时下载less包 |
| css-loader  | 对@import 和 url() 进行处理 |
| style-loader | 解析css样式 |




#### 处理文件的loader
|  loader   | 作用  |
|  ----  | ----  |
| url-loader  |将文件转为base64编码|
| file-loader  | 将文件打包至静态文件夹下面| 

> 注意： 一般在处理小文件的时候使用url-loader，可以减少网络请求的次数。文件过大时一般用file-loader，防止首屏加载过慢