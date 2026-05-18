---
title: vue父子组件的生命周期顺序
date: "2020-02-18 16:39:33"
categories:
  - 《Vue》笔记
  - 组件
tags:
  - Vue
author: xugaoyi
vdoing_source: docs/《Vue》笔记/02.组件/90.vue父子组件的生命周期顺序.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# vue父子组件的生命周期顺序

### 加载渲染过程

```
父beforeCreate -> 父created-> 父beforeMount-> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted
```

父组件会先执行到beforeMount，接着会执行子组件钩子到挂载结束，再挂载父组件。

### 子组件更新过程

```
父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated
```

### 父组件更新过程

```
父beforeUpdate -> 父updated
```

### 销毁过程

```
父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8AVue%E3%80%8B%E7%AC%94%E8%AE%B0/02.%E7%BB%84%E4%BB%B6/90.vue%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%A1%BA%E5%BA%8F.md) 的 `docs/《Vue》笔记/02.组件/90.vue父子组件的生命周期顺序.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
