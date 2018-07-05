const http = require('http');  // 内置的 http模块  提供了HTTP服务器和客户端功能
const url = require('url');    // 内置的 url模块   提供了解析 URL 字符串的一些方法
const path = require('path');  // 内置的 path模块  提供了与目录路径相关的功能
const querystring = require('querystring');  // 内置的 querystring模块  提供了一些实用函数，用于解析与格式化 URL 查询字符串

const serveStaticFile = require("./serveStaticFile"); // 处理静态资源
const handles = require('./handles'); // 引入 controller 和 action
const staticDir = "static";  // 设置静态文件目录, 请求路径匹配成功, 则读取文件夹对应文件, 设置MIME并返回

// 启动http服务器
http.createServer(async (req, res) => {
  // req 服务器收到的 http请求
  // res 用于返回     http响应

  // ---- 获取url地址上的 查询参数   ?cid=84e4f5e6-4624-11e4-a6b0-de77df093b44
  const url_parsed = url.parse(req.url, true);
  req.query = url_parsed.query;
  req.pathname = url_parsed.pathname;
  req.rootPath = __dirname;

  // ---- 获取http 请求体body中的参数
  if (req.method === "POST" || req.method === "PUT") {
    req.body = {};
    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
      // 获取请求体 (二进制)
      let body = await parseBody(req);
      // 请求体二进制 转为 字符串
      body = body.toString("utf8");
      // 解析参数
      body = querystring.parse(body);
      req.body = body;
    }
  }

  // 处理静态文件, 读取本地文件 并 输出http响应
  if (new RegExp(`^\/${staticDir}\/`).test(req.url)) {
    // 处理静态文件
    serveStaticFile(req, res);
    return;
  }

  // 处理其他请求:
  // 路由格式为: /controller/action
  // 这里定义的路由规则为:
  // controller会对应到一个控制器，action对应到控制器的行为
  // 例如路径/user/userinfo => controller 为 user,  action 为 userinfo
  if (new RegExp(`^\/[a-zA-Z]+\/[a-zA-Z]+`).test(req.url)) {
    const paths = req.pathname.split('/'); // 分割路径 //  ["","user","userinfo"]
    const controller = paths[1] || 'index'; // 获取 controller 名  //  "user"
    const action = (paths[2] || 'index') + "Action"; // 获取 action 名  //  "userinfo" + "Action" => "userinfoAction"
    if (handles[controller] && typeof handles[controller][action] === "function") {
      handles[controller][action](req, res);
      return;
    }
  }

  // 其他情况 返回404
  send404(req, res);
}).listen(6789, '0.0.0.0');


// 获取请求体
function parseBody (req, callback) {
  var chunks = [];
  var size = 0;

  req.on('data', chunk => {
    // chunk 二进制片段
    chunks.push(chunk);
    size += chunk.length;
  });

  if (typeof callback === "function") {
    req.on('end', () => {
      const buf = Buffer.concat(chunks, size);
      callback(buf);
    });
  } else {
    return new Promise((resolve, reject) => {
      req.on('end', () => {
        const buf = Buffer.concat(chunks, size);
        resolve(buf);
      });
    })
  }
};

// 返回404
function send404 (req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.write('404 Not Found');
  res.end();
}



// -----------------------------------
/*
路径
const url = '/user/userinfo?cid=84e4f5e6-4624-11e4-a6b0-de77df093b44';
const url_parsed = url.parse(url,true) 解析完后为:
{
  "search": "?cid=84e4f5e6-4624-11e4-a6b0-de77df093b44",
  "query": {
    "cid": "84e4f5e6-4624-11e4-a6b0-de77df093b44",
  },
  "pathname": "/user/userinfo",
  "path": "/user/userinfo?cid=84e4f5e6-4624-11e4-a6b0-de77df093b44"
}

req.query = url_parsed.query;
req.pathname = url_parsed.pathname;
* */
