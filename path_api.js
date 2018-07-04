const path = require('path');  // 内置的 path模块  提供了与目录路径相关的功能

let a1 = path.join(__dirname,"./aaaaa/bbbb")
let a2 = path.join(__dirname,"../aaaaa/bbbb")
let a3 = path.join(__dirname,"/aaaaa/bbbb")

let b1 = path.resolve(__dirname,"./aaaaa/bbbb")
let b2 = path.resolve(__dirname,"../aaaaa/bbbb")
let b3 = path.resolve(__dirname,"/aaaaa/bbbb")

console.log("__dirname:", __dirname);
console.log("a1:   ",a1);
console.log("a2:   ",a2);
console.log("a3:   ",a3);

console.log("b1:   ",b1);
console.log("b2:   ",b2);
console.log("b3:   ",b3);
