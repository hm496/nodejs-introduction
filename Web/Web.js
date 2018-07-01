const http = require('http');  // 内置的 http模块  提供了HTTP服务器和客户端功能
const url = require('url');    // 内置的 url模块   提供了解析 URL 字符串的一些方法
const path = require('path');  // 内置的 path模块  提供了与目录路径相关的功能

const serveStaticFile = require("./serveStaticFile"); // 处理静态资源
const handles = require('./handler'); // 引入 controller 和 action
const staticDir = "static";  // 设置静态文件目录, 请求路径匹配成功, 则读取文件夹对应文件, 设置MIME并返回

// 启动http服务器
http.createServer((req, res) => {
  const url_parsed = url.parse(req.url, true);
  req.url_parsed = url_parsed; // 将解析后的路径 挂在请求上, 供后续使用
  req.staticDirRoot = path.join(__dirname, staticDir); // 将静态文件路径根目录 挂在请求上, 供后续使用
  /*
  路径: /index.html?a=1&b=2
  url_parsed:
  {
    "search": "?a=1&b=2",
    "query": {
      "a": "1",
      "b": "2"
    },
    "pathname": "/index.html",
    "path": "/index.html?a=1&b=2"
  }
  * */

  // 处理静态文件, 读取文件并输出
  if (req.url.startsWith("/" + staticDir)) {
    serveStaticFile(req, res);
    return;
  }


  /*
  处理其他请求
  路由实现: 匹配路径,调用对应handle
  /controller/action/a/b/c
  这里的 controller会对应到一个控制器，action对应到控制器的行为，剩余的值会作为参数
  */
  const paths = url_parsed.pathname.split('/'); // 分割路径
  const controller = paths[1] || 'index'; // 获取 controller 名
  const action = (paths[2] || 'index') + "Action"; // 获取 action 名

  const args = paths.slice(3);
  if (handles[controller] && handles[controller][action]) {
    handles[controller][action].apply(null, [req, res].concat(args));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.write('404 Not Found');
    res.end();
  }
}).listen(6789, '0.0.0.0');
