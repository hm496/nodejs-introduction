// const wanfeifei = require('./sql.js');

module.exports = {
  // user controller
  user: {
    // userinfo action
    userinfoAction (req, res, ...other) {
      if (req.url_parsed.query && req.url_parsed.query.cid) {
        res.writeHead(500, { 'Content-Type': 'application/json' }); // 设置json MIME
        res.end(JSON.stringify({
          code: 104,
          message: "该用户不存在",
        }));

        // wanfeifei.query(`SELECT * FROM user_user WHERE cid = ?`,
        //   [req.url_parsed.query.cid],
        //   function (err, results) {
        //     res.writeHead(200, { 'Content-Type': 'application/json' }); // 设置json MIME
        //     if(results[0]){
        //       res.end(JSON.stringify({
        //         code: 0,
        //         data: results[0],
        //         message:""
        //       }));
        //     } else {
        //       res.end(JSON.stringify({
        //         code: 104,
        //         message: "该用户不存在",
        //       }));
        //     }
        //   });
      } else {
        const data = {
          code: 102,
          message: "参数错误"
        }
        res.writeHead(500, { 'Content-Type': 'application/json' }); // 设置json MIME
        res.end(JSON.stringify(data));
      }
    },
    // login action
    loginAction (req, res) {
      const data = {
        code: 0,
        message: "登录成功!"
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }); // 设置json MIME
      res.end(JSON.stringify(data));
    },
    // logout action
    logoutAction (req, res) {
      const data = {
        code: 0,
        message: "退出成功!"
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }); // 设置json MIME
      res.write(JSON.stringify(data));
      res.end();
    }
  }
}
