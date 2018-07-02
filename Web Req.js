const http = require('http');  // 内置的 http模块  提供了HTTP服务器和客户端功能

const req = http.request({
  hostname: "www.baidu.com",
  method: "GET",
  path: "/index.html",
}, function (res) {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });
  res.on('end', () => {
    console.log('响应中已无数据。');
  });
})

req.end();
