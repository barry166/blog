---
title: 一行代码“黑”掉任意网站
date: "2021-11-25 14:33:51"
categories:
  - 更多
  - 实用技巧
tags:
  - JavaScript
  - css
  - 实用技巧
author: xugaoyi
vdoing_source: docs/04.更多/10.实用技巧/10.一行代码“黑”掉任意网站.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
titleTag: 原创
sticky: 1
---
# 一行代码“黑”掉任意网站

实用技巧：只需一行代码，轻轻一点就可以把任意网站变成暗黑模式。
<p align="center"><img src="/img/vdoing/vdoing-dcebaf/qq20211125-163111-2tmjlvz28n80-82ad5b2e94.png" width="500" style="cursor: zoom-in;"></p>

<!-- more -->

首先我们先做一个实验，在任意网站中，打开浏览器开发者工具(F12)，在`Console`控制台输入如下代码并回车：

```js
document.documentElement.style.filter='invert(85%) hue-rotate(180deg)'
```

神奇的事情发生了，当前打开的网站变成了暗黑模式。

> **详情：原理解释**
> 1. `document.documentElement` 获取文档对象的根元素，即`<html>`元素
> 2. 给`html`元素的`.style`样式添加`filter`滤镜样式为`invert(85%) hue-rotate(180deg)`
> 3. `invert()` 反转图像。
> 4. `hue-rotate()`色相旋转。
>
> 更多滤镜知识：[`filter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)。


为了更方便实用，达到轻轻一点就可以对网页施加魔法🎉，

我们对代码做了一点点🤏🏻改动。（修正了滤镜对图片等元素的影响）
```js
javascript: (function () {  const docStyle = document.documentElement.style;  if (!window.modeIndex) {    window.modeIndex = 0;  }  const styleList = [    '',    'invert(85%) hue-rotate(180deg)',   'invert(100%) hue-rotate(180deg)',  ];  modeIndex = modeIndex >= styleList.length - 1 ? 0 : modeIndex + 1;  docStyle.filter = styleList[modeIndex];  document.body.querySelectorAll('img, picture, video').forEach(el => el.style.filter = modeIndex ? 'invert(1) hue-rotate(180deg)' : '');})();
```

然后打开浏览器书签管理器，添加新书签，在网址栏粘贴这段代码并保存：
<p align="center"><img src="/img/vdoing/vdoing-dcebaf/qq20211125-154655-1byvlo5a60xs-576729cc84.png" width="600" style="cursor: zoom-in;"></p>

以后在任意网站，只需要轻轻一点`切换模式`书签就可以让它变成85%的暗黑，再点一次就是100%的暗黑，再点一次变回正常模式。

<p align="center"><img src="/img/vdoing/vdoing-dcebaf/qq20211125-163111-2tmjlvz28n80-82ad5b2e94.png" width="600" style="cursor: zoom-in;"></p>

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/04.%E6%9B%B4%E5%A4%9A/10.%E5%AE%9E%E7%94%A8%E6%8A%80%E5%B7%A7/10.%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E2%80%9C%E9%BB%91%E2%80%9D%E6%8E%89%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99.md) 的 `docs/04.更多/10.实用技巧/10.一行代码“黑”掉任意网站.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
