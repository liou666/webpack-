## webpack学习记录



>webpack执行依赖于webpack-cli

- 执行`webpack`命令，默认从`./src/index.js`进行打包，默认输出位置为`./dist`文件夹。
也可以通过指令`webpack --entry ./src/index.js --output-path build`更改打包入口和输出路径。
- 开发中一般不会直接去在终端中这样用，通常会把配置统一放在`webpack.config.js`文件中



