---
title: 判断是否为移动端浏览器
date: "2020-01-04 15:25:11"
categories:
  - 前端
  - JavaScript文章
tags:
author: xugaoyi
vdoing_source: docs/01.前端/25.JavaScript文章/60.判断是否为移动端浏览器.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# 判断是否为移动端浏览器

```js
const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
if(flag){
    // 移动端
} else {
    // PC端
}
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/01.%E5%89%8D%E7%AB%AF/25.JavaScript%E6%96%87%E7%AB%A0/60.%E5%88%A4%E6%96%AD%E6%98%AF%E5%90%A6%E4%B8%BA%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%B5%8F%E8%A7%88%E5%99%A8.md) 的 `docs/01.前端/25.JavaScript文章/60.判断是否为移动端浏览器.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
