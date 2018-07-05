#!/usr/bin/env node

'use strict';
const globby = require('globby');
const path = require('path');
const fs = require('fs');
const args = process.argv.slice(2);
const { dateFmt } = require('../utils.js');

const processDir = fs.realpathSync(process.cwd());
// re-name *.png *.jpg -o @yyyyMMdd hhmmss@$name$$i$.$ext$
class RenameCli {
  constructor (args) {
    this.$outFmt$ = ""; // 输出格式 路径  // @yyyyMMdd hhmmss@$name$$i$.$ext$
    this.$filePattern$ = []; // 文件匹配规则 // *.png
    this.initOption(args);

    this.filePaths = []; // 查找到的文件绝对路径
  }

  initOption (args) {
    const outIndex = args.indexOf('-o');
    this.$filePattern$ = args.slice(0, outIndex);
    this.$outFmt$ = args[outIndex + 1];
  }

  async findFiles () {
    const paths = await globby(this.$filePattern$);
    paths.forEach(item => {
      let fileSplited = item.match(/([^\/\\]+)\.([^.]+)$/);
      if (!fileSplited) {
        fileSplited = [];
        fileSplited[1] = item;
        fileSplited[2] = "";
      }
      this.filePaths.push({
        path: path.join(processDir, item),
        dir: path.dirname(path.join(processDir, item)),
        name: fileSplited[1],
        ext: fileSplited[2],
      })
    })
    return Promise.resolve(this);
  }

  runRename () {
    this.filePaths.forEach((item, index) => {
      if (!this.$outFmt$) return;
      let newPath = path.join(item.dir, this.$outFmt$);
      // 替换时间
      newPath = newPath.replace(/@([^@]+)@/, ($0, $1, $2) => {
        if ($1 && $1.length) {
          return dateFmt(new Date(), $1)
        }
        return ""
      })
      newPath = newPath.replace(/\$i\$/gi, index);   // 替换自增
      newPath = newPath.replace(/\$name\$/gi, item.name);  // 替换文件名
      newPath = newPath.replace(/\$ext\$/gi, item.ext);  // 替换扩展名
      fs.rename(item.path, newPath, (err) => {
        err && console.error(err);
      });
    })
  }
}

(async () => {
  const renameCli = await new RenameCli(args).findFiles();
  renameCli.runRename();
})();
