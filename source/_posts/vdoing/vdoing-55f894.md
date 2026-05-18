---
title: CSS给table的tbody添加滚动条
date: "2022-06-29 09:34:23"
categories:
  - 页面
  - CSS
tags:
author: xugaoyi
vdoing_source: docs/02.页面/20.CSS/70.CSS给table的tbody添加滚动条.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
```css
table tbody {
  height: 200px;
  overflow-y: auto;
  display: block;
}

table thead,
tbody tr {
  display: table;
  width: 100%;
}
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/02.%E9%A1%B5%E9%9D%A2/20.CSS/70.CSS%E7%BB%99table%E7%9A%84tbody%E6%B7%BB%E5%8A%A0%E6%BB%9A%E5%8A%A8%E6%9D%A1.md) 的 `docs/02.页面/20.CSS/70.CSS给table的tbody添加滚动条.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
