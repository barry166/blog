---
title: flex布局案例-骰子
date: "2019-12-25 14:27:01"
categories:
  - 页面
  - CSS
tags:
author: xugaoyi
vdoing_source: docs/02.页面/20.CSS/03.flex布局案例-骰子.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# flex布局案例-骰子

> 可用<kbd>F12</kbd>开发者工具查看元素及样式，可打开codepen在线编辑代码。

```html
```html
<html>
  <div class="box2">
    <div class="first-face">
      <span class="pip"></span>
    </div>
    <div class="second-face">
      <span class="pip"></span>
      <span class="pip"></span>
    </div>
    <div class="third-face">
      <span class="pip"></span>
      <span class="pip"></span>
      <span class="pip"></span>
    </div>
    <div class="fourth-face">
      <div class="column">
        <span class="pip"></span>
        <span class="pip"></span>
      </div>
      <div class="column">
        <span class="pip"></span>
        <span class="pip"></span>
      </div>
    </div>
    <div class="fifth-face">
      <div class="column">
        <span class="pip"></span>
        <span class="pip"></span>
      </div>
      <div class="column">
        <span class="pip"></span>
      </div>
      <div class="column">
        <span class="pip"></span>
        <span class="pip"></span>
      </div>
    </div>
    <div class="sixth-face">
      <div class="column">
        <span class="pip"></span>
        <span class="pip"></span>
        <span class="pip"></span>
      </div>
      <div class="column">
        <span class="pip"></span>
        <span class="pip"></span>
        <span class="pip"></span>
      </div>
    </div>
  </div>
</html>
<style>
  /* 一 */
  .first-face { /* 形成上下左右居中 */
    display: flex;
    /* 项目在主轴上居中 */
    justify-content: center;
    /* 项目在交叉轴上居中 */
    align-items: center;
  }
  /* 二 */
  .second-face {
    display: flex;
    /* 两侧对齐 */
    justify-content: space-between;
  }
  .second-face .pip:nth-of-type(2) {
    /* 居下 */
    align-self: flex-end;
  }/* 三 */
  .third-face {
    display: flex;
    /* 两侧对齐 */
    justify-content: space-between;
  }
  .third-face .pip:nth-of-type(2) {
    /* 居中 */
    align-self: center;
  }
  .third-face .pip:nth-of-type(3) {
    /* 居下 */
    align-self: flex-end;
  }
  /* 四 、六*/
  .fourth-face,
  .sixth-face {
    display: flex;
    /* 两侧对齐 */
    justify-content: space-between;
  }
  .fourth-face .column,
  .sixth-face .column {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 两侧对齐 */
    justify-content: space-between;
  }
  /* 五 */
  .fifth-face {
    display: flex;
    /* 两侧对齐 */
    justify-content: space-between;
  }
  .fifth-face .column {
    display: flex;
    /* 纵向排列 */
    flex-direction: column;
    /* 两侧对齐 */
    justify-content: space-between;
  }
  .fifth-face .column:nth-of-type(2) {
    /* 居中对齐 */
    justify-content: center;
  }
/* 基础样式 */
.box2 {
  display: flex;
  /* 项目在交叉轴上居中 */
  align-items: center;
  /* 项目在主轴上居中 */
  justify-content: center;
  vertical-align: center;
  /* 允许项目换行 */
  flex-wrap: wrap;  /* 项目是多行时以交叉轴中心对齐 */
  align-content: center;
  font-family: 'Open Sans', sans-serif;
}
/* 类名包含face的元素 */
[class$="face"] {
  margin: 5px;
  padding: 4px;  background-color: #e7e7e7;
  width: 104px;
  height: 104px;
  object-fit: contain;  box-shadow:
    inset 0 5px white,
    inset 0 -5px #bbb,
    inset 5px 0 #d7d7d7,
    inset -5px 0 #d7d7d7;  border-radius: 10%;
}
.pip {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 4px;  background-color: #333;
  box-shadow: inset 0 3px #111, inset 0 -3px #555;
}
</style>
```
```

> 参考：<http://www.ruanyifeng.com/blog/2015/07/flex-examples.html>

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/02.%E9%A1%B5%E9%9D%A2/20.CSS/03.flex%E5%B8%83%E5%B1%80%E6%A1%88%E4%BE%8B-%E9%AA%B0%E5%AD%90.md) 的 `docs/02.页面/20.CSS/03.flex布局案例-骰子.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
