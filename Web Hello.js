const http = require('http');  // 内置的 http模块  提供了HTTP服务器和客户端功能
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' }); // 设置http响应头
  res.end(`<div style="border:1px solid red;">Hello World</div>`); // 设置http响应体
}).listen(6789, '0.0.0.0');
/*
尽管这个HTTP服务器如此简单,只能回复 Hello World,但它能维持的并发量和QPS不容小觑
* */
