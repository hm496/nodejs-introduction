## Part 0 ：Node.js简介

### a）Node.js简介

```
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
```

- Node.js 是 JavaScript 运行时环境, 就和浏览器一样, 浏览器也是一个 JavaScript 运行时环境，Node.js 扩展了 js 功能，使之支持 I/O操作 、文件系统等只有后端语言才有的特性.

- Node.js 构建在著名的 Chrome's V8 引擎之上，Chrome V8 引擎以 C/C++ 为主，用于执行 JavaScript 代码，并转成 C/C++ 调用，大大的降低了学习成本

- Node.js  基于事件驱动（event-driven），非阻塞异步 I/O 模型（non-blocking I/O model），简单点就是每个I/O操作都是异步的，最后由 C/C++ 编写的事件循环处理库来处理这些 I/O 操作，隐藏了非阻塞 I/O 的具体细节，简化并发编程模型，让你可以轻松的编写高性能的Web应用，所以 Node.js 是轻量（lightweight）且高效（efficient）的

  ![chrome vs nodejs](https://raw.githubusercontent.com/hm496/nodejs-introduction/master/img/chrome_nodejs.png)

### b）基本原理

下面是 Node.js 的架构图，
它简要的介绍了 Node.js 是基于 Chrome V8引擎构建的，由事件循环（Event Loop）分发 I/O 任务，最终工作线程（Work Thread）将任务丢到线程池（Thread Pool）里去执行，而事件循环（Event Loop）只要等待执行结果就可以了。

![](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14912707129964/14912763353044.png)

![](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14912707129964/14992384974942.png)

- Chrome V8 是 JavaScript 引擎

- Node.js 内置 Chrome V8 引擎，所以它使用的 JavaScript 语法

- JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事

- 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

- 如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 I/O 很慢，不得不等着结果出来，再往下执行

- CPU 完全可以不管 I/O 设备，挂起处于等待中的任务，先运行排在后面的任务, 将

- 等待中的 I/O 任务放到 Event Loop 里, 由 Event Loop 将 I/O 任务放到线程池里 异步执行，

- 拿排队(同步)和叫号机(异步)来理解:

  - 排队(同步)：在排队的时候，你除了等之外什么都干不了
  - 叫号机(异步)：你要做的是先取号码(发出异步请求)，等轮到你的时候，系统会通知你(执行回调函数)，这中间，你可以做任何你想做的事儿

  Node.js 其实就是帮我们构建类似的机制。我们在写代码 ,发出异步请求的时候，实际上就是取号的过程，由 Event Loop 来接受处理，而真正执行I/O 操作是在线程池里 。之所以说 Node.js 是单线程，就是因为在接受任务(取号)的时候是单线程的，它无需进程/线程切换上下文的成本，非常高效，但它在执行具体任务(在线程池执行)的时候是多线程的。

  ![](https://raw.githubusercontent.com/hm496/nodejs-introduction/master/img/loop.png)

梳理一下,  核心:
- Chrome V8 负责解释并执行 JavaScript 代码

- `libuv` 由事件循环和线程池组成，负责所有 I/O 任务的分发与执行

-  Node.js Bindings层, 负责将 libuv 暴露的 `C/C++` 接口绑定到 Chrome V8 引擎转成 JavaScript Api , 并且结合这些 Api 编写了 Node.js 标准库，所有这些 Api 统称为 Node.js SDK, 核心模块


## Part 1：Event Loop(事件循环)
先拿定时器举例,
定时器是最简单的异步调用
```javascript
setTimeout(function() {
  // bala bala
},1000);
```
每次设置定时器,其实是将一个回调函数
放入一个队列中,
只要还有异步任务未执行,
事件循环,就会一直轮询检查系统时间,
是否满足定时器条件.
满足条件则执行队列中 所有满足条件的回调函数.



Node.js Event Loop 完整过程示例:
Node 只有一个主线程，事件循环是在主线程上完成的。
Event Loop开始执行前,
会先完成 所有的同步任务、设置定时器回调函数、发出异步请求并设置回调函数 , 初始化事件循环等等,
最后，等完成这些之后，事件循环才会开始。
事件循环会一轮又一轮地执行，直到所有异步任务都执行完成后,  退出主进程。



每一次 Event Loop 经过以下几个阶段:
![event-loop](https://static.didapinche.com/pics//g/1530329437896/event-loop.jpg)

Node.js 除原生定时器setTimeout,setInterval外,
还提供 两个非I/O操作的异步函数  **setImmediate** , **process.nextTick()** ;

- timers 阶段: 这个阶段执行setTimeout(callback) and setInterval(callback)预定的callback;
- I/O callbacks 阶段: 执行除了 close事件的callbacks、定时器(setTimeout、setInterval等)设定的callbacks、setImmediate设定的callbacks之外的callbacks;
- idle, prepare 阶段: 仅node内部使用,为poll 阶段 做准备;
- poll 阶段: 获取新的I/O事件, 适当的条件(没有定时器到期,没有其他阶段的异步回调)下node将阻塞在这里, 等待新的I/O事件触发并执行回调函数;
- check 阶段: 执行setImmediate() 设定的callbacks;
- close callbacks 阶段: close事件的callbacks,比如socket.on(‘close’, callback)的callback会在这个阶段执行.

每一个阶段都有一个装有callbacks的fifo queue(队列)，当event loop运行到一个指定阶段时，
node将执行该阶段队列的回调函数，当队列callback执行完或者执行callbacks数量超过该阶段的上限时，
event loop会转入下一下阶段.

**注意上面六个阶段都不包括 process.nextTick()**
**process.nextTick()不在event loop的任何阶段执行，而是在各个阶段切换的中间执行**,即从一个阶段切换到下个阶段前执行。

## Part 2：模块机制
### 描述文件  `package.json` 

1.  主要描述了你的项目依赖哪些模块

2.  允许我们使用 “语义化版本规则”指明你项目依赖包的版本 (用 "^","~" 等符号指定版本)

3.  让你的构建更好地与其他开发者分享，便于重复使用

### package.json 如何创建

使用 `npm init` 即可在当前目录创建一个 `package.json` ,

 `package.json`  形如:

```json
{
  "name": "koa",
  "version": "2.5.1",
  "description": "Koa web app framework",
  "main": "lib/application.js",
  "engines": {
    "node": ">=6"
  },
  "dependencies": {
    "cookies": "~0.7.1"
  },
  "devDependencies": {
    "eslint": "^3.17.1",
    "jest": "20.0.0"
  }
}
```

"cookies": "~0.7.1" ,    中的 ~ 表示,  依赖版本为 0.7.xx,    且大于等于0.7.1

"eslint": "^3.17.1" ,      中的 ^ 表示,  依赖版本为 3.xx.xx,  且大于等于3.17.1

"jest": "20.0.0",             表示  依赖版本就为固定 20.0.0  

npm install
npm install --production



### 模块安装 `npm`

Node.js 周边的生态非常强大，NPM（Node包管理器）上有超过 **73万个模块**，周下载量超过 **26亿次 **

- npm基本命令

| 名称 | 描述 | 简写 |
| --- | --- | --- |
| npm install xxx | 安装xxx模块, 会默认记录到package.json里dependencies, 添加到生产环境依赖 | npm i xxx |
| npm install --save xxx | 安装xxx模块，并且记录到package.json里dependencies，添加到生产环境依赖 | npm i -S xxx |
| npm install --save-dev xxx | 安装xxx模块，并且记录到package.json里，字段对应的devDependencies，是开发环境必须依赖的模块，比如测试模块的（mocha、chai、sinon、zombie、supertest等）,语法检查模块 ( eslint 等) | npm i -D xxx |
| npm install --global xxx | 全局安装xxx模块，但不记录到package.json里，如果模块里package.json有bin配置，会自动链接，作为cli命令 | npm i -g xxx |


### 模块引用
- 引用 Node.js核心模块 或 自定义模块 (下载到 node_modules 中的模块), 直接引用包名即可:
```javascript
const http = require("http");
```

- 引用文件模块, 以. 或 .. 或 / 开始的, 都会被当作文件模块:
```javascript
const add = require("./add.js");
```

Node.js 根据引用的标识符**查找**模块:

- 如果是 Node.js 核心模块,则直接加载核心模块;

- 如果是文件模块,则去加载对应路径的 js 文件;

- 如果是自定义模块,即非核心模块,
  先在运行目录的 node_modules 中查找模块,
  没找到,就往上级目录中的 node_modules 查找,
  一层一层往上级目录 node_modules 查找,
  直到根目录 node_modules 查找,

### 模块导出

- 第一种

```javascript
// 假设文件名为 a.js
exports.name = 'Bob';
```
- 第二种 ,  实现同样功能代码

```javascript
// 假设文件名为 b.js
module.exports = {
  name: 'Bob',
}
```

- 引用刚才的模块

```javascript
// 假设与上模块同一目录
let a = require("./a");
console.log(a.name === "Bob");  // true
```


- ***常见的问题*** :

  我想输出一个name 属性 和 一个add 函数:
```javascript
// -------- 符合预期的代码 -------- 001
module.exports = {
  name: 'Bob',
  add: function (a, b) {
    return a + b;
  }
}
// -------- 符合预期的代码 -------- 002
exports.name = 'Bob';
exports.add = function (a, b) {
  return a + b;
}

// -------- 错误的代码 -------- 001
exports = {
  name: 'Bob',
  add: function (a, b) {
    return a + b;
  }
}
// -------- 错误的代码 -------- 002
exports.name = 'Bob';
module.exports = {
  add: function (a, b) {
    return a + b;
  }
}
```

### require 引用原理
- require 形如如下函数
```javascript
function require(...) {
  var module = { exports: {} };
  ((module, exports) => {
     // ------ 模块代码 开始------
        exports = {
          name: 'Bob',
        }
     // ------ 模块代码 结束------
  })(module, module.exports);
  return module.exports;
}
```
```javascript
module.exports = {};
let exports = module.exports;

exports = {
    name: 'Bob'
};

// module.exports !== exports;

return module.exports;
```

> module.exports 和 exports 的区别: exports 仅仅是 module.exports 的一个引用
> 给 exports 直接赋值，只是让这个变量等于另外一个引用

## Part 3：搭建简单 Node.js web 服务器

- 用 Node.js 实现 以下两个功能:
  - 简单的路由功能       (实现路由功能, 并提供数据接口)
  - 提供静态文件服务   (读取静态资源,  html,js,css,图片等静态文件, 并由浏览器显示)
- 涉及 Nodejs核心模块:
  - http模块       提供了HTTP服务器和客户端功能          (http.createServer,  http.request等)
  - 
  	 fs模块	     提供了文件系统,读写文件相关的功能    (fs.readfile, fs.readfile等)
  - path模块      提供了处理目录路径相关的功能            (path.join, path.resolve等)
  - url模块         提供了解析 URL 字符串的一些方法       (url.parse等)

#### Hello Node.js

 ```javascript
const http = require('http');  // Node内置的 http模块  提供了HTTP服务器和客户端功能
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' }); // 设置http响应头
  res.end(`<div style="border:2px solid red;">Hello Node.js</div>`); // 设置http响应体
}).listen(6789, '0.0.0.0');   // 监听 6789 端口
 ```



## Part 4：Node.js 如何处理异步 (异步流程控制)

####  1) 异步流程控制重点

![async](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14913280187332/Screen%20Shot%202017-04-05%20at%2008.43.34.png)


1. Node.js SDK 里原生API都是 callback ;
2. Node.js 异步流程控制重点:   Promise 与 Async函数;
    1. 中流砥柱：Promise 
    2. 终极解决方案：Async/Await 



#### 2)  Node.js SDK 的回调函数采用  Error-first Callback (错误优先) 的写法:


```javascript
// 读取文件
fs.readFile("user.txt", function (err, data) {
    // 处理错误 和 正常逻辑
});
```

- 回调函数的第一个参数返回的 error 对象，如果 error 发生了，它会作为第一个err参数返回，如果没有错误，返回 `null`。
- 回调函数的第二个参数返回的是任何成功响应的结果数据。如果结果正常，没有error发生，err会被设置为`null`，并在第二个参数就出返回成功结果数据。

如果进行 几个异步操作, 每一步都需要上一个异步操作 的结果作为参数,   这种写法很容易出现 **回调嵌套** 的问题 :

```javascript
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```

这里只是做4步, 嵌套了4层回调, 如果更多步骤呢？



#### 3)  中流砥柱  Promise :

Promise意味着[许愿|承诺]一个还没有完成的操作，但在未来会完成的。

- 每个 Promise 操作都返回  Promise  实例对象
- Promise 有三种状态:  未完成 pending,   成功 resolved,   失败 rejected

1)定义 
所有Promise定义都是一样的，在构造函数里传入一个匿名函数，参数是resolve和reject，分别代表成功和失败时候的处理。

```javascript
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…
  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  } else {
    reject(Error("It broke"));
  }
});
```

2)API 及 使用

##### 与Promise最主要的交互方法是:

1. 将回调函数 传入它的 then  方法 ,   从而获得 Promise  成功时 resolve  的值 ,
2. 将回调函数 传入它的 catch 方法 ,  从而获得 Promise  失败时 reject     的值.

##### Promise 实例,  有2个 实例方法:

- promise.then()
- promise.catch()

```javascript
var promise = new Promise(function(resolve, reject) {
   setTimeout(function() {
       resolve("Stuff worked!");
   }, 200)
});

promise.then(function(text){
    console.log(text)// Stuff worked!
    return Promise.reject('我是故意的')
}).catch(function(err){
    console.log("err:" + err)
}).then(function(text) {
    console.log("then:" + text)
})

// promise.then(function(res){})      用于  Promise  成功时resolve   的处理;
// promise.catch(function(err){})     用于  Promise  失败时reject    的处理;

// Promise 可以链式调用, 在then 或 catch 方法中 的返回值, 会作为参数传到后面 then 或 catch 方法中

promise.then(function(text){
    console.log(text)// Stuff worked!
    return '我是故意的'
}).catch(function(err) {
    console.log("err:" + err)
}).then(function(text) {
    console.log("then:" + text)
})
```

##### Promise 类,  有4个 静态方法:

- Promise.resolve(...)
- Promise.reject(...)
- Promise.all([...])
- Promise.race([...])

```javascript
Promise.resolve("123");
// 返回一个 状态为成功resolved 的 promise 实例, 
// 用 then 的回调函数 获取所传参数;   // "123"

Promise.reject("789");
// 返回一个 状态为失败rejected 的 promise 实例, 
// 用 catch 的回调函数 获取所传参数;  // "789"
```

```javascript
Promise.all([promise1,promise2,promise3]);  
// 接收一个 promise 实例数组, 

// 当所有 promise 执行成功, 执行 Promise.all([...]).then() 中回调函数, 回调函数参数为 所有promise返回值的数组

// 若某个 promise 执行失败, 则执行 Promise.all([...]).catch() 中回调函数, 参数为 执行失败promise 的返回值
```

```javascript
Promise.race([promise1,promise2,promise3]);  
// 接收一个 promise 实例数组, 

// 若某个 promise 率先执行完成, 无论成功失败, 
// 则Promise.race([...]) 变成和 率先完成的 promise 一样的状态, 返回其返回值, 
// 成功调用 Promise.race([...]).then(), 失败调用 Promise.race([...]).catch()
```
##### Promise 如何解决 callback 回调嵌套

```javascript
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```
- Promise 写法

```javascript
var promise1 = function() {
   return new Promise(function(resolve, reject) {
       setTimeout(function() {
           let value1 = 1;
           resolve(value1);
       }, 100)
   });
}

var promise2 = function(value1) {
   return new Promise(function(resolve, reject) {
       setTimeout(function() {
           let value2 = value1 + 20;
           resolve(value2);
       }, 200)
   });
}

var promise3 = function(value2) {
   return new Promise(function(resolve, reject) {
       setTimeout(function() {
           let value3 = value2 + 300;
           resolve(value3);
       }, 300)
   });
}

var promise4 = function(value3) {
   return new Promise(function(resolve, reject) {
       setTimeout(function() {
           let value4 = value3 + 4000;
           resolve(value4);
       }, 400)
   });
}

promise1().then(value1 => promise2(value1)).then(value2 => promise3(value2)).then(value3 => promise4(value3)).then(value4 => {
    console.log("最终结果:" + value4)
})
```
```javascript
// 读取文件
fs.readFile("user.txt", function (err, data) {
    // 处理错误 和 正常逻辑
});

// 改造为 promise
let fs_promise = function (path) {
    return new Promise((resolve,reject) => {
       fs.readFile(path, function (err, data) {
       		if(err){
                reject(err)
            } else {
                resolve(data)
            }
       });
    })
}
```

#### 5) 终极解决方案 async / await  :

```javascript
(async() => {
    const value1 = await promise1();  // value1 为 promise1 成功时 的返回值
    const value2 = await promise2(value1);
    const value3 = await promise3(value2);
    const value4 = await promise4(value3);
    console.log("最终结果:" + value4);
})();
```

##### async / await 异常处理

```javascript
// 处理错误 与 处理同步错误一样, 通过try catch ;
// catch 捕获当 promise 失败时 reject 的返回值;
(async() => {
    try {
       const val1 = await Promise.resolve('val1 resolved');
       // const val2 = await Promise.reject('val2 rejected');
       // console.log("最终val2: " + val1);
       
       console.log("最终val1: " + val1);
    } catch (e) {
       console.log("错误 :" + e);
    }
})();
```



## Part 5：Node.js 的使用场景，以模块维度划分 

| 分类 | 描述 | 相关模块 |
| --- | --- | --- |
| 网站 | 传统 Web 网站 | `Express` / `Koa` |
| API | 同时提供给 Android, IOS，PC, H5 等前端使用的 HTTP API 接口 | `Restify` / `HApi` |
| PC客户端 /          编辑器 | 钉钉 PC客户端 基于 `nw.js`,  微软的 `VSCode` 编辑器 基于 `electron` | `electron`   /    `nw.js` |
| IM即时聊天 | 实时应用，很多是基于 `WebSocket`协议的 | `Socket.io` /`ws` |
| 反向代理 | 提供类似于 `nginx` 反向代理功能，但对前端更友好 | `anyproxy` / `http-proxy` |
| 前端构建打包工具 | 辅助前端开发，尤其是各种预编译，构建相关的工具，能够极大的提高前端开发效率:    将ES6语法转为ES5 语法, 将less, sass等css预编译语言转为css,并自动处理一些css兼容问题 | `Webpack` / `rollup` |
| 命令行工具 | 使用命令行是非常酷的方式，前端开发自定义了很多相关工具，无论是shell命令，node脚本，还是各种脚手架等 | `Cordova` / `vue-maker` |
| 操作系统 | 有实现，但估计不太会有人用 | `NodeOS` |
| 爬虫 | 有大量的爬虫模块，比如crawler等，写起来要简单一些，搭配`cheerio`（node版本的 jQuery ）类库的，对前端来说尤其友好 | `crawler`/`cheerio`  |

- 更多模块参考  https://github.com/sindresorhus/awesome-nodejs







