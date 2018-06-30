let startDate = Date.now();
/*初始化 even loop 耗时,导致顺序不确定*/
setTimeout(() => {
  console.log("setTimeout", Date.now() - startDate);
}, 0);
setImmediate(() => {
  console.log("setImmediate", Date.now() - startDate);
});
// (() => console.log("sync", Date.now() - startDate))();
