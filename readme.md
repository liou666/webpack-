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
| file-loader  | 将文件打包至静态文件夹下面（处理字体图标也用这个）| 

> 注意： 一般在处理小文件的时候使用url-loader，可以减少网络请求的次数。文件过大时一般用file-loader，防止首屏加载过慢

#### 资源模块(asset module)
**webpack 5**出现， 它允许使用资源文件（字体，图标等）而无需配置额外 `loader`。

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：
|  asset   | 作用  |  相当于 |
|  ----  | ----  | ---- |
| asset/resource  |发送一个单独的文件并导出 URL。|之前通过使用 file-loader 实现|
| asset/inline  | 导出一个资源的 data URI| 之前通过使用 url-loader 实现| 
|asset/source| 导出资源的源代码|之前通过使用 raw-loader 实现|
|asset| 在导出一个 data URI 和发送一个单独的文件之间自动选择|之前通过使用 url-loader，并且配置资源体积限制实现|

#### 常用的插件
"clean-webpack-plugin": "^4.0.0",
    "copy-webpack-plugin": "^9.0.1",
    "css-loader": "^6.3.0",
    "file-loader": "^6.2.0",
    "html-webpack-plugin": "^5.3.2",

|  插件   | 作用  |
|  ----  | ----  |
| clean-webpack-plugin  |每次打包的时候删除原先的目录|
| html-webpack-plugin  | 配置打包的html模板| 
| copy-webpack-plugin  | 将文件整体打包到dist文件夹下| 
| DefinePlugin  | 配置全局变量（webpack内置插件）| 