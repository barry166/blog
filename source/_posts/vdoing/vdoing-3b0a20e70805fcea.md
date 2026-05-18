---
title: 使用animate库
date: "2020-02-17 16:05:52"
categories:
  - 《Vue》笔记
  - "过渡&动画"
tags:
  - Vue
author: xugaoyi
vdoing_source: "docs/《Vue》笔记/03.过渡&动画/112.使用animate库.md"
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# vue中使用Animate.css库


## 自定义过渡类名

我们可以通过以下 attribute 来自定义过渡类名：

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)
<!-- more -->
他们的优先级高于普通的类名，这对于 Vue 的过渡系统和其他第三方 CSS 动画库，如 [Animate.css](https://daneden.github.io/animate.css/)结合使用十分有用。


## 使用Animate.css库

```html
<transition
            name="custom-classes-transition"
            enter-active-class="animated tada"
            leave-active-class="animated bounceOutRight"
            >
    <p v-if="show">hello</p>
</transition>
```

按 [官方文档](https://github.com/daneden/animate.css) 引入Animate.css库，再配合vue的自定义过渡类名，指定`enter-active-class`和`leave-active-class`的自定义类，两者都要有`animated`类，用于说明其使用的是Animate.css库，再根据需求定义另外一个`动画类名`。

动画类名：在 [Animate官网](https://daneden.github.io/animate.css/) 获取。


## Demo

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="html,result" data-user="xugaoyi" data-slug-hash="JjdXBmy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vue中使用animate.css库">
  <span>See the Pen <a href="https://codepen.io/xugaoyi/pen/JjdXBmy">
  vue中使用animate.css库</a> by xugaoyi (<a href="https://codepen.io/xugaoyi">@xugaoyi</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
```html
&lt;script async src="https://static.codepen.io/assets/embed/ei.js">&lt;/script>
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8AVue%E3%80%8B%E7%AC%94%E8%AE%B0/03.%E8%BF%87%E6%B8%A1%26%E5%8A%A8%E7%94%BB/112.%E4%BD%BF%E7%94%A8animate%E5%BA%93.md) 的 `docs/《Vue》笔记/03.过渡&动画/112.使用animate库.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
