// const http = require('http');  // Node内置的 http模块  提供了HTTP服务器和客户端功能
//
//
// var parsePostBody = function (req, done) {
//   var arr = [];
//   var chunks;
//
//   req.on('data', buff => {
//     arr.push(buff);
//   });
//
//   req.on('end', () => {
//     chunks = Buffer.concat(arr);
//     done(chunks);
//   });
// };
//
// http.createServer((req, res) => {
//   parsePostBody(req, function (buffer) {
//     res.writeHead(200, { 'Content-Type': 'text/html' }); // 设置http响应头
//     res.end(`<div style="border:2px solid red;">Hello Node.js  ${buffer.toString()}</div>`); // 设置http响应体
//   })
// }).listen(6789, '0.0.0.0');   // 监听 6789 端口

// const url = require('url');    // 内置的 url模块   提供了解析 URL 字符串的一些方法
//
// let a = url.parse("/user/userinfo?cid=84e4f5e6-4624-11e4-a6b0-de77df093b44", true)
// console.log(a)
