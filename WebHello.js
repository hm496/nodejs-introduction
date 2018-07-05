const http = require('http');  // Node内置的 http模块  提供了HTTP服务器和客户端功能
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' }); // 设置http响应头
  res.end(`<div style="border:2px solid red;">Hello Node.js</div>`); // 设置http响应体
}).listen(6789, '0.0.0.0');   // 监听 6789 端口
