---
title: nodejs递归读取所有文件
date: "2019-12-26 15:57:32"
categories:
  - 技术
  - Nodejs
tags:
author: xugaoyi
vdoing_source: docs/03.技术/03.Nodejs/01.nodejs递归读取所有文件.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# nodejs递归读取所有文件
```js

var fs = require('fs');
var path = require('path');
 
function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    console.log(files);
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {      
            readFileList(path.join(dir, item), filesList);  //递归读取文件
        } else {                
            filesList.push(fullPath);                     
        }        
    });
    return filesList;
}
 
var filesList = [];
readFileList(__dirname,filesList);
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/03.%E6%8A%80%E6%9C%AF/03.Nodejs/01.nodejs%E9%80%92%E5%BD%92%E8%AF%BB%E5%8F%96%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6.md) 的 `docs/03.技术/03.Nodejs/01.nodejs递归读取所有文件.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
