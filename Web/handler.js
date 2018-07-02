const wanfeifei = require('./sql.js');

module.exports = {
  // index controller
  index: {
    // userinfo action
    userinfoAction (req, res, ...other) {
      if (req.url_parsed.query && req.url_parsed.query.cid) {
        wanfeifei.query(`SELECT id,cid,account_id FROM user_user WHERE cid = ?`,
          [req.url_parsed.query.cid],
          function (err, results) {
            res.writeHead(200, { 'Content-Type': 'application/json' }); // 设置json MIME
            res.end(JSON.stringify(results));
          });
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
      res.end(JSON.stringify(data));
    }
  }
}
