---
title: 子组件派发事件和值给父组件
date: "2020-02-04 12:56:51"
categories:
  - 《Vue》笔记
  - 组件
tags:
  - Vue
author: xugaoyi
vdoing_source: docs/《Vue》笔记/02.组件/50.子组件派发事件和值给父组件.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# 子组件派发事件和值给父组件

[API](https://cn.vuejs.org/v2/guide/components.html#监听子组件事件)

子组件通过`$emit`派发事件和值给父组件（值可以有多个）
```js
this.$emit('fnX', value)
```
<!-- more -->
父组件通过`v-on`绑定子组件派发的事件，并触发一个新的事件，新的事件内可以接收传来的值
```js
<ComponentName @fnX="fnY"></ComponentName>


methods: {
	fnY(value) {
		console.log(value)
	}
}
```

## 父子组件间传递数据 demo

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-user="xugaoyi" data-slug-hash="mdJVqgg" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="mdJVqgg">
  <span>See the Pen <a href="https://codepen.io/xugaoyi/pen/mdJVqgg">
  mdJVqgg</a> by xugaoyi (<a href="https://codepen.io/xugaoyi">@xugaoyi</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
```html
&lt;script async src="https://static.codepen.io/assets/embed/ei.js">&lt;/script>
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8AVue%E3%80%8B%E7%AC%94%E8%AE%B0/02.%E7%BB%84%E4%BB%B6/50.%E5%AD%90%E7%BB%84%E4%BB%B6%E6%B4%BE%E5%8F%91%E4%BA%8B%E4%BB%B6%E5%92%8C%E5%80%BC%E7%BB%99%E7%88%B6%E7%BB%84%E4%BB%B6.md) 的 `docs/《Vue》笔记/02.组件/50.子组件派发事件和值给父组件.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
