module.exports = {
  // index controller
  index: {
    // userinfo action
    userinfoAction (req, res) {
      const data = {
        code: 0,
        data: {
          name: "小红",
          age: 16,
          sex: "男",
        },
        message: ""
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }); // 设置json MIME
      res.end(JSON.stringify(data));
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
