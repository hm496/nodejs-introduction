## Part 0 ：Node.js简介

### a）什么是Node.js？

```
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
```

- Node.js 是 JavaScript 运行时环境，同时扩展了 js 功能，使之支持 I/O 、文件系统等只有后端语言才有的特性，使 JS 既可以操作浏览器 又可以进行I/O 、文件读写、操作数据库等.

- Node.js 构建在著名的 Chrome's V8 JavaScript 引擎之上，Chrome V8 引擎以 C/C++ 为主，相当于使用 JavaScript 写法，转成 C/C++ 调用，大大的降低了学习成本

- 事件驱动（event-driven），非阻塞 I/O 模型（non-blocking I/O model），就是每个函数都是异步的，最后由 C/C++ 编写的事件循环处理库来处理这些 I/O 操作，隐藏了非阻塞 I/O 的具体细节，简化并发编程模型，让你可以轻松的编写高性能的Web应用，所以它是轻量（lightweight）且高效（efficient）的
 
- Node.js 编写的包管理工具 npm 已成为开源包管理领域最好的生态，目前有
超过**73万**模块，每周下载量超过**23亿次**。

### b）基本原理

下面是一张 Node.js 的架构图，
它简要的介绍了 Node.js 是基于 Chrome V8引擎构建的，由事件循环（Event Loop）分发 I/O 任务，最终工作线程（Work Thread）将任务丢到线程池（Thread Pool）里去执行，而事件循环只要等待执行结果就可以了。

![](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14912707129964/14912763353044.png)

- Node.js 基于 Chrome V8 引擎
- JavaScript 语言的一大特点就是单线程，同一个时间只能做一件事
- 单线程就意味着，所有任务需要排队，一个一个执行.
- 但排队很多时候是 CPU 空闲, 而要等待很慢的 I/O, CPU 完全可以不管 I/O 设备，挂起处于等待中的任务，先运行排在后面的任务

![](https://raw.githubusercontent.com/i5ting/How-to-learn-node-correctly/master/media/14912707129964/14992384974942.png)

核心
- Chrome V8 负责解释并执行 JavaScript 代码
- `libuv` 由事件循环和线程池组成，负责所有 I/O 任务的分发与执行
- Node.js Bindings层,就是将 Chrome V8 等暴露的 `C/C++` 接口转成JavaScript Api，  
并且结合这些 Api 编写了 Node.js 标准库，所有这些 Api 统称为 Node.js SDK

在解决并发问题上，异步是最好的解决方案，可以拿排队和叫号机来理解

- 排队：在排队的时候，你除了等之外什么都干不了
- 叫号机：你要做的是先取号码，等轮到你的时候，系统会通知你，这中间，你可以做任何你想做的事儿

Node.js 其实就是帮我们构建类似的机制。我们在写代码的时候，实际上就是取号的过程，由 Event Loop 来接受处理，而真正执行操作的是具体的线程池里的 I/O 任务。之所以说 Node.js 是单线程，就是因为在接受任务的时候是单线程的，它无需进程/线程切换上下文的成本，非常高效，但它在执行具体任务的时候是多线程的。

## Part 1：Event Loop(事件循环)
先拿定时器举例,
定时器是最简单的异步调用
```javascript
setTimeout(function() {
  // bala bala
},0);
```
每次设置定时器,其实是将一个回调函数  
放入一个先进先出(FIFO)的队列中,  
只要还有异步任务未执行,  
事件循环,就会一轮又一轮的执行,  
每一次都去检查系统时间,是否满足定时器条件.  
满足条件则执行回调函数. 

Node.js Event loop 完整过程示例:  
每一次 Event loop 经过以下几个阶段:
```
   ┌───────────────────────┐
┌─>│        timers         │ (setTimeout,setInterval)
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```
- timers 阶段: 这个阶段执行setTimeout(callback) and setInterval(callback)预定的callback;
- I/O callbacks 阶段: 执行除了 close事件的callbacks、被timers(定时器，setTimeout、setInterval等)设定的callbacks、setImmediate()设定的callbacks之外的callbacks;
- idle, prepare 阶段: 仅node内部使用;
- poll 阶段: 获取新的I/O事件, 适当的条件下node将阻塞在这里;
- check 阶段: 执行setImmediate() 设定的callbacks;
- close callbacks 阶段: 比如socket.on(‘close’, callback)的callback会在这个阶段执行.

每一个阶段都有一个装有callbacks的fifo queue(队列)，当event loop运行到一个指定阶段时，
node将执行该阶段的fifo queue(队列)，当队列callback执行完或者执行callbacks数量超过该阶段的上限时，
event loop会转入下一下阶段.
> https://cnodejs.org/topic/57d68794cb6f605d360105bf
