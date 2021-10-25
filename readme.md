## webpack 学习记录

> webpack 执行依赖于 webpack-cli

- 执行`webpack`命令，默认从`./src/index.js`进行打包，默认输出位置为`./dist`文件夹。
  也可以通过指令`webpack --entry ./src/index.js --output-path build`更改打包入口和输出路径。
- 开发中一般不会直接去在终端中这样用，通常会把配置统一放在`webpack.config.js`文件中。执行`webpack`进行打包的时候默认会先走`webpack.config.js`配置文件，可以通过`webpack --config ./myconfig.js`命令指定默认配置文件

### loader 使用

> webpack 不能直接处理样式或者图片等文件需要借助 loader 完成。

loader 的使用有两种方式：

1. 配置方式（推荐）：在 `webpack.config.js` 文件中指定 `loader`。**module.rules**
   ```js
   module: {
     rules: [
       {
         test: /\.css$/,
         use: ['style-loader', 'css-loader'], //从右向左执行
       },
     ]
   }
   ```
2. 内联方式：在每个 `import` 语句中显式指定 `loader`，需要用！隔开 `例如：import "css-loader!./css/index.css"`

#### 样式 loader

| loader         | 作用                                                       |
| -------------- | ---------------------------------------------------------- |
| postcss-loader | 将 css 增加浏览器前缀 （配合插件 postcss-preset-env 使用） |
| less-loader    | 处理 less 文件 需同时下载 less 包                          |
| css-loader     | 对@import 和 url() 进行处理                                |
| style-loader   | 解析 css 样式                                              |

#### 处理文件的 loader

| loader      | 作用                                               |
| ----------- | -------------------------------------------------- |
| url-loader  | 将文件转为 base64 编码                             |
| file-loader | 将文件打包至静态文件夹下面（处理字体图标也用这个） |

> 注意： 一般在处理小文件的时候使用 url-loader，可以减少网络请求的次数。文件过大时一般用 file-loader，防止首屏加载过慢

#### 资源模块(asset module)

**webpack 5**出现， 它允许使用资源文件（字体，图标等）而无需配置额外 `loader`。

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：
| asset | 作用 | 相当于 |
| ---- | ---- | ---- |
| asset/resource |发送一个单独的文件并导出 URL。|之前通过使用 file-loader 实现|
| asset/inline | 导出一个资源的 data URI| 之前通过使用 url-loader 实现|
|asset/source| 导出资源的源代码|之前通过使用 raw-loader 实现|
|asset| 在导出一个 data URI 和发送一个单独的文件之间自动选择|之前通过使用 url-loader，并且配置资源体积限制实现|

#### 常用的插件

"clean-webpack-plugin": "^4.0.0",
"copy-webpack-plugin": "^9.0.1",
"css-loader": "^6.3.0",
"file-loader": "^6.2.0",
"html-webpack-plugin": "^5.3.2",

| 插件                 | 作用                             |
| -------------------- | -------------------------------- |
| clean-webpack-plugin | 每次打包的时候删除原先的目录     |
| html-webpack-plugin  | 配置打包的 html 模板             |
| copy-webpack-plugin  | 将文件整体打包到 dist 文件夹下   |
| DefinePlugin         | 配置全局变量（webpack 内置插件） |

#### loader 和 plugin 的区别

- `loader`是用于**特定的模块类型**进行转化
- `plugin`可以用于**执行更广泛的任务**，比如打包优化、资源管理等。

* `loader`即为文件加载器，操作的是**文件**，将文件 A 通过`loader`转换成文件 B，**是一个单纯的文件转化过程。** **运行在打包文件之前。**

* `plugin`即为插件，是一个扩展器，丰富`webpack`本身，增强功能 ，针对的是在`loader`结束之后，`webpack`打包的整个过程，**他并不直接操作文件，而是基于事件机制工作**，监听`webpack`打包过程中的某些节点，执行广泛的任务。 **在整个编译周期都起作用**

#### devtool

此选项控制是否生成，以及如何生成 `source map`,**方便代码调试。**

> 注意不要混淆 devtool 字符串的顺序,顺序是:
> `[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map.`

**最佳实践：**

- 开发环境，推荐使用 source-map 或者 cheap-module-source-map（这分别是 vue 和 react 使用的值，可以获得调试信息，方便快速开发）
- 发布阶段：建议使用 false 或者 none

### DevServe 与 HMR

每次修改完代码之后，都需要重新执行 `npm run build` 命令，很繁琐。并且每次编译过程中都会生成新的文件**也就是进行了文件操作**，**所以效率很低**。

- **第一种解决方案**：**通过`webpack`自带的`watch`来监听文件的变化。**
  在打包的时候加上参数 `--watch`即可。`webpack --watch`
  也可以在`webpack.config.js`文件中配置`{watch：true}`,
  **这样就能在文件发生变化是自动重新打包。
  但是实质上还是每次对所有文件进行编译，然后生成新的文件。所以效率也是很低的**

- **第二种解决方案**：**通过 webpack-dev-server 这个插件完成。**
  安装`webpack-dev-server`之后，在终端执行`webpack serve`命令，会默认开启一个服务，当源文件发生变化的时候，会自动重新编译。与上面 watch 方式不同的是，**`webpack-dev-server`内部会开启一个额 express 服务，并将编译后的文件存入内存中，不会进行文件操作，所以效率会有所提高。但是每次编译后浏览器会刷新整个页面。**

### 开启 HMR

> HMR（模块热更新）可以做到在应用程序运行的过程当中，替换，删除，添加，修改模块，而不刷新整个页面。

开启 HMR，需要在`webpack.config.js`文件中配置

```js
devServer: {
  hot: true
}
```

然后再去指定对应模块去使用热更新。

```js
//指定math.js模块也更新（vuex就使用的这种方式）
if (module.hot) {
   module.hot.accept("./math.js", () => {
       console.log("math.js changed!")
   })
}。
```

### Vue 和 React 中使用 HMR

- **React 中使用的是通过插件`react-refresh`来实现。**
  首先安装相关依赖 `npm install @pmmmwh/react-refresh-webpack-plugin react-refresh -D`然后修改`webpack.config.js`和`babel.config.js`文件。

  ```js
  //webpack.config.js
  const ReactRefreshWebpackPlugi=require  ('react-refresh-webpack-plugin')
  module.exports={
      plugins:[
          new ReactRefreshWebpackPlugin()
      ]
  }
  /*******************************/
  //babel.config.js

   module.exports={
       presets:[
           ["@babel/preset-env"],
           ["@babel/preset-react]
       ]
       plugins:[
          ["react-refresh/babel"]
       ]
   }

  ```

- **Vue 的加载需要使用 vue-loader，而 vue-loader 加载的组件默认会帮我们进行 HMR 的处理**

### HMR 原理

**webpack-dev-server 会创建两个服务:提供静态资源的服务( express )和 Socket 服务( net.Socket) **;

- express server 负责直接提供静态资源的服务**(打包后的资源直接被浏览器请求和解析)**;

- HMR Socket Server，**是一个 socket 的长连接:当服务器监听到对应的模块发生变化时，会生成两个文件 json (manifest 文件)和 js 文件( update chunk)**;通过长连接，可以直接将这两个文件主动发送给客户端(浏览器);浏览器拿到两个新的文件后，通过**HMR runtime 机制**，加载这两个文件，并且针对修改的模块进行更新;

### 代码分离

常用的代码分离方法有三种：

- **入口起点：使用 `entry` 配置手动地分离代码。**
  ```js
  entry: {
      "math": "./src/math.js",
      "index": "./src/index.js"
  },
  output: {
      filename: "[name]-bundle.js",//这里的[name]对应的就是entry中的key。
      path: path.resolve(__dirname, "../dist")
  },
  ```
  **注意**：如果我们在`math.js` 和`index.js`中引入一个第三方库如`loadsh`，那么打包之后的两个文件都会有`loadsh`。这是个问题。
- **防止重复：使用 `Entry dependencies` 或者 `SplitChunksPlugin` 去重和分离 `chunk`。**
  上述模块重复的问题，可以通过配置 `dependOn option` 选项来解决。
  `js entry: { math: { import: "./src/math.js", dependOn: 'shared' }, index: { import: "./src/index.js", dependOn: 'shared' }, shared: ["loadsh"] }, `
  也可以通过插件 SplitChunksPlugin 去除重复的模块。
  `js entry: { math: "./src/math.js", index: "./src/index.js", }, optimization: { splitChunks: { chunks: 'all', }, }, `

- **动态导入：通过模块的内联函数调用来分离代码。**
  > `webpack`对于异步导入的模块会自动处理成单独的`chunk`。

如果想为打包的`chunk`命名可以在`output`选项中配置`chunkFilename`

```js
output: {
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",//这里指定chunk的名字
      path: path.resolve(__dirname, "../dist")
}
```

有时候我们想把对个模块都打包在同个异步块 (`chunk`) 中。只需要使用一个特殊的注释语法来提供 `chunk name` 。

```js
import(/* webpackChunkName: "group" */ './Foo.js')
import(/* webpackChunkName: "group" */ './Bar.js')
import(/* webpackChunkName: "group" */ './Baz.js')

//经过webpack打包后会生成一个group.chunk.js的文件
```

### Tree Shaking

webpack 实现 Tree Shaking 采用了两种方案

- usedExports:通过标记某些函数是否被调用，之后通过 Terser 来进行优化。**当设置 usedExports 为 true 时，打包后的代码中会在没有副作用的代码片段上增加注释`/* unused harmony export cut */`。之后通过 Terser 来清除掉该代码。**
  ```js
  //开发环境下development
  optimization: {
      usedExports: true,//production模式下默认为true
      minimize: true,
      minimizer: [
          new Terser()
      ]
  }
  ```
- sideEffects:跳过整个模块/文件，直接查看该文件是否有副作用。

```js
//bar.js
export function bar(a) {
  return a + 'bar'
}
window.aaa = '123' //这里产生了副作用
//-------------------------------------

//index.js入口文件
import './bar'
console.log(window.aaa)
```

如果采用第一种方案，虽然会删除掉`bar`函数，但是会保留函数导入的代码，如果想删除干净可以在`package.json`文件中配置**`sideEffects`为`false`（表示所有模块都被看做无副作用的）**

```js
//package.json
  "sideEffects":false,

//或者也可以通过数组的方式指定特定模块为有副作用的模块

//package.json
  "sideEffects":[
       "./src/bar.js",
       "**.css"
   ] ,

```

### npm 包发布

通常我们在 npm 发布一个工具包的时候很难同时对 node 环境和浏览器环境做到同时兼容。但是如果用打包工具进行 npm 包的发布会解决这个问题。

```js
//index.js
//不使用打包工具时，在浏览器上使用这个包会出问题
import { math } from './lib/math.js'

export { format, math }
```

```js
//使用webpack打包之后，再对打包之后的包进行发布
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
    libraryTarget: 'umd', //指定模块
    library: 'util_liou', //打包之后的包名，也是挂载到全局的一个变量名
    globalObject: 'this', //指定要挂在的哪个对象上，'this'表示在全局对象（浏览器是window，node环境为global）
  },
}
```

### webpack 原理

> webpack 本身是个函数，返回一个 compiler，调用 compiler.run()
> 方法开始构建依赖。

```js
//webpack函数
const webpack = (options, callback) => {

  const create = () => {
    let compiler
    let watch = false
    let watchOptions;

    //如果option为数组则创建多个compiler，一般情况下optoin为对象
    if (Array.isArray(options)) {
      compiler = createMultiCompiler(options)
      ...
    } else {
        //这里创建compiler（关键！！！）createCompiler函数在下面👇
      compiler = createCompiler(webpackOptions)
      ...
    }
    return {
      compiler,
      watch,
      watchOptions,
    }
  }


//如果传了callback，自动调用compiler.run方法,无需手动调用
  if (callback) {
      const { compiler, watch, watchOptions } = create()
      if (watch) {
        compiler.watch(watchOptions, callback)
      } else {
        compiler.run((err, stats) => {
          compiler.close((err2) => {
            callback(err || err2, stats)
          })
        })
      }
      return compiler
    }
  } else {
    const { compiler } = create()

    return compiler
  }
}
```

```js
//createCompiler函数

const createCompiler = (rawOptions) => {
  const options = getNormalizedWebpackOptions(rawOptions)
  applyWebpackOptionsBaseDefaults(options)

  //new Compiler初始化了一系列的hook
  const compiler = new Compiler(options.context)

  compiler.options = options

  new NodeEnvironmentPlugin({
    infrastructureLogging: options.infrastructureLogging,
  }).apply(compiler)

  //注册插件
  //插件可以为函数也可以为对象
  //当插件为函数时，将compiler传入函数中，并绑定this到compiler上
  //当插件为对象时，调用对象的apply方法，并将compiler作为参数传入
  if (Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    }
  }

  applyWebpackOptionsDefaults(options)
  compiler.hooks.environment.call()
  compiler.hooks.afterEnvironment.call()

  //将配置文件中除plugins之外的所有属性（比如entry/devtool/output）转为插件形式
  new WebpackOptionsApply().process(options, compiler)
  compiler.hooks.initialize.call()
  return compiler
}
```

**执行 compiler.run()**

```js
class Compiler {
    constructor(context) {
      this.hooks = Object.freeze({
        initialize: new SyncHook([]),
        shouldEmit: new SyncBailHook(['compilation']),
        ...
      }),
      this.root=this,
      ...
    }


	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);
			this.hooks.compile.call(params);
            //这里创建compilation实例（注：这里的实例是可变的）
            //更改配置文件时，需要重新创建compiler，但是修改非配置文件时，没有必要重新创建compiler，只需要重新创建compilation即可。
			const compilation = this.newCompilation(params);
            //关键的生命周期make
			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);
				this.hooks.finishMake.callAsync(compilation, err => {...});
			});
		});
	}




    run(callback) {
	const finalCallback = (err, stats) => {...};

	this.running = true;

	const onCompiled = (err, compilation) => {...}

	const run = () => {
        //注册生命周期hook，并开始编译
		this.hooks.beforeRun.callAsync(this, err => {
			if (err) return finalCallback(err);
			this.hooks.run.callAsync(this, err => {
			   if (err) return finalCallback(err);
				this.readRecords(err => {
					if (err) return finalCallback(err);
					this.compile(onCompiled); //开始编译（关键！！！）
				});
			});
		});
	}


	run();

	}


}
```

### 自定义 loader

> loader 本质上就是一个函数，这个函数会在我们在我们加载一些文件时执行。注意不能用箭头函数，因为会改变 this。

**同步 loader**

```js
//liou-loader.js
module.exports = function (context) {
  //context就是文件里面的内容
  //这里可以通过 this.query API拿到配置文件中options里面的参数
  let { name, age } = this.query

  let res = context + `姓名：${name} 年龄：${age}`

  //这里可以通过这种形式返回
  return res

  //也可以通过回调的方式返回(第一个参数是错误处理，第二个参数是返回结果，第三个参数是source-map)
  return this.callbak(null, res)
}
```

```js
//webpack.config.js
module.exports = function (context) {
   module: {
        rules: [{
                test: /\.js/,
                use: [{
                        loader: "liou-loader",
                        options: {
                            name: 'liou',
                            age: 18
                        }
                    }
                ]

            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', './src/loaders'],
    },
}
```

**异步 loader**

```js
module.exports = function (context) {
  let { name, age } = this.query

  let res = context + `姓名：${name} 年龄：${age}`
  //通过调用this.async处理异步loader
  let asyncfunc = this.async()
  setTimeout(() => {
    asyncfunc(null, res)
  }, 2000)
}
```

### 自定义 plugin
