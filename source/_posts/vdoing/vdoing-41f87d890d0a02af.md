---
title: 解决百度无法收录搭建在GitHub上的个人博客的问题
date: "2019-12-25 14:27:01"
categories:
  - 技术
  - 博客搭建
tags:
author: xugaoyi
vdoing_source: docs/03.技术/04.博客搭建/01.解决百度无法收录搭建在GitHub上的个人博客的问题.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# 解决百度无法收录搭建在GitHub上的静态博客的问题

> **警告**
> 如果你正在寻找本博客的搭建文档，博主建议您查看这个仓库的[README](https://github.com/xugaoyi/vuepress-theme-vdoing)。

## 背景

由于GitHub禁止百度爬虫访问，造成托管在GitHub Pages上的博客无法被百度收录。相关问题可以通过百度站长平台的`抓取诊断`再现，每次都是403 Forbidden的错误。

<!-- more -->

## 解决方案

同时将博客同时同步托管到GitHub Pages和[coding pages](https://dev.tencent.com/)上，解决百度不收录问题。最后发现在国内使用coding pages打开速度特别快，而且还会被百度收录，因此我把coding pages的站点作为主站点，原本在github pages的作为分站点。


步骤：

1、注册[coding](https://dev.tencent.com/)账号，创建仓库，把代码推送到coding仓库，并开启pages服务。

> git 操作部分和使用github的差不多，不了解git操作的可以看我的另一篇文章：[Git使用手册](https://xugaoyi.com/pages/9a7ee40fc232253e/)

2、我的博客项目使用vuepress搭建的，使用的是如下自动部署脚本，同时将代码推送到github和conding。

```sh
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# github
echo 'b.xugaoyi.com' > CNAME
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:xugaoyi/blog.git master:gh-pages # 发布到github

# coding
echo 'xugaoyi.com' > CNAME
git add -A
git commit -m 'deploy'
git push -f git@git.dev.tencent.com:xugaoyi/xugaoyi.git master # 发布到coding

cd - # 退回开始所在目录
rm -rf docs/.vuepress/dist
```

> 因为我想给两个平台上绑定不同的自定义域名，因此我分开创建了CNAME文件。

3、有自定义域名的，也可以在coding pages绑定自定义域名，域名DNS解析中添加CNAME记录指向coding pages的站点地址即可。（没有自定义域名的可忽略，同时把自动部署脚本中的创建CNAME文件的脚本去掉）


最后，使用百度站长的抓取诊断，发现抓取成功啦，再使用百度站长的[链接提交](https://ziyuan.baidu.com/linksubmit/index)功能，把链接提交给百度，过一段时间就可能在百度搜索中搜索到啦。


### 如何知道百度有没有收录？

在百度搜索框中使用site:<链接地址\>，如：

```
site:xugaoyi.com
```


## 相关文章

[《GitHub Actions 定时运行代码：每天定时百度链接推送》](https://xugaoyi.com/pages/f44d2f9ad04ab8d3/)

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/03.%E6%8A%80%E6%9C%AF/04.%E5%8D%9A%E5%AE%A2%E6%90%AD%E5%BB%BA/01.%E8%A7%A3%E5%86%B3%E7%99%BE%E5%BA%A6%E6%97%A0%E6%B3%95%E6%94%B6%E5%BD%95%E6%90%AD%E5%BB%BA%E5%9C%A8GitHub%E4%B8%8A%E7%9A%84%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E7%9A%84%E9%97%AE%E9%A2%98.md) 的 `docs/03.技术/04.博客搭建/01.解决百度无法收录搭建在GitHub上的个人博客的问题.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
