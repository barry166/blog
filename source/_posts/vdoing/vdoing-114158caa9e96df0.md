---
title: MVVM模式
date: "2020-02-04 12:19:00"
categories:
  - 《Vue》笔记
  - 基础
tags:
  - Vue
author: xugaoyi
vdoing_source: docs/《Vue》笔记/01.基础/00.MVVM模式.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
> **提示**
>
> 说明：本章内容是博主的Vue学习笔记，以[官方文档](https://cn.vuejs.org/v2/guide/)为准。
>


# MVVM模式

MVVM模式，`M`即 model，数据模型；`V`即 view，视图；`VM`即 view-model，视图模型。
<!-- more -->
![](/img/vdoing/vdoing-114158caa9e96df0/20200204123438-22537ae1d1.png)

**理解**

首先，数据Model通过Data Bindings把数据绑定在View视图上，

当View视图有交互（有改变）的时候，Dom listeners会自动监听，然后更新数据Model。


**Q：什么是MVVM模式？**

A：MVVM模式，第一个M代表数据模型，V代表视图，VM代表视图模型；
它的实际操作原理是：后台数据通过视图模型来渲染视图，就是页面。当用户在页面上进行操作的时候，
视图模型会自动监听到用户的操作，从而改变后台数据。

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8AVue%E3%80%8B%E7%AC%94%E8%AE%B0/01.%E5%9F%BA%E7%A1%80/00.MVVM%E6%A8%A1%E5%BC%8F.md) 的 `docs/《Vue》笔记/01.基础/00.MVVM模式.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
