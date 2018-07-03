const a = new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      JSON.parse("")
    } catch (e) {
      return reject(e)
    }
  }, 1000)
});

a.then(function (data) {
  console.log(data)
}).catch(function (e) {
  console.log("错误")
  return Promise.resolve(222);
}).then(function (e) {
  console.log(e)
}).catch(function (e) {
  console.log("错误2")
}).catch(function (e) {
  console.log("错误3")
});

