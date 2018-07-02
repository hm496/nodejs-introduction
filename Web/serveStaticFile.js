const fs = require('fs');      // 内置的 fs模块    提供了文件系统,读写文件相关的功能
const path = require('path');  // 内置的 path模块  提供了与目录路径相关的功能
const { getType } = require('./MIME.js');

function send404 (res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.write('Error 404: resource Not Found');
  res.end();
}

function set_header_MIME (res, absPath) {
  let ext = absPath.match(/[^.]+$/);
  if (ext && ext[0]) {
    res.writeHead(200, { 'Content-Type': getType(ext[0]) }); // 设置http响应头 Content-Type
    // res.writeHead(200, { 'Content-Type': 'applicatoin/octet-stream' }); // 需要浏览器下载文件时, 设置为 applicatoin/octet-stream
  }
}

function serveStatic (req, res) {
  let absPath = path.join(__dirname, req.url_parsed.pathname);  // 获取文件绝对路径

  if (absPath.endsWith("\\")) {
    absPath = path.join(req.staticDirRoot, "index.html")
  }

  if (absPath === req.staticDirRoot) {
    send404(res);
    return;
  }

  fs.readFile(absPath, function (err, data) {
    //readFile回调函数
    if (err) {
      console.log(err);
      send404(res);
    } else {
      // 文件存在,读取静态文件
      set_header_MIME(res, absPath); // 设置http响应头 Content-Type
      res.end(data);
    }
  });

  // 判断文件是否存在
  // fs.stat(absPath, function (err, stats) {
  //   if (err) {
  //     // 不存在
  //     send404(res);
  //   } else {
  //     // 文件存在,读取静态文件
  //     set_header_MIME(res, absPath); // 设置http响应头 Content-Type
  //
  //     // 创建 readable stream 可读流
  //     const readable = fs.createReadStream(absPath, { highWaterMark: 64 * 1024 })
  //     readable.pipe(res); // 通过流的方式 将文件输出到响应
  //     readable.on('err', (chunk) => {
  //       send404(res);
  //     });
  //   }
  // })
}

module.exports = serveStatic;
