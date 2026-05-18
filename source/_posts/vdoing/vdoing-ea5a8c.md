---
title: Git分支的新建与合并-分支操作
date: "2020-11-18 17:43:57"
categories:
  - 《Git》学习笔记
tags:
  - Git
author: xugaoyi
vdoing_source: docs/《Git》学习笔记/20.文档笔记/30.Git分支的新建与合并-分支操作.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# Git分支的新建与合并-分支操作

文档：[Git 分支 - 分支的新建与合并](https://git-scm.com/book/zh/v2/Git-分支-分支的新建与合并)


### 创建分支并切换

此时有一个需求需要在新的分支`iss53`上工作：

```sh
$ git checkout -b iss53  # b表示branch
```

它是下面两条命令的简写：

```sh
$ git branch iss53
$ git checkout iss53
```


### 切换分支

突然有一个紧急问题要解决，需要在原来的`master`分支进行修复：

```sh
$ git checkout master
```

在切换到`master`之前，需要`iss53`分支保持好一个干净的状态（修改都已提交）。

**注意：切换分支Git 会重置你的工作目录。**

>  `checkout` 中文含义 “检出”，`checkout <branch>` 检出分支 => 检出指定分支的代码 => 重置工作目录并切换分支。


接下来，你要修复这个紧急问题。 建立一个 `hotfix` 分支，在该分支上工作直到问题解决：

```sh
$ git checkout -b hotfix

# 中间过程在hotfix上修改了代码并提交
$ echo 'test' > ./hotfix.txt
$ git add .
$ git commit -m 'fixed'
```


### 合并分支

```sh
$ git checkout master # 首先切回master分支
$ git merge hotfix # 把 hotfix 分支合并过来
```


### 删除分支

```sh
$ git branch -d hotfix # d表示delete

# 然后切回iss53继续工作
$ git checkout iss53
```

注意删除分支是在 `branch` 命令上


### 多次提交之后合并分支

假设你已经修正了 #53 问题，打算合并到`master`分支：

```sh
$ git checkout master
$ git merga iss53
```

这看似和之前的合并区别不大。此时你的开发历史从一个更早的地方开始分叉开来（diverged）。 因为，`master` 分支所在提交并不是 `iss53` 分支所在提交的直接祖先，Git 不得不做一些额外的工作。 出现这种情况的时候，Git 会使用两个分支的末端所指的快照以及这两个分支的公共祖先，做一个简单的**三方合并**。

和之前将分支指针向前推进所不同的是，**Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它**。 这个被称作一次合并提交，它的特别之处在于他有不止一个父提交。


### 遇到冲突时的分支合并

 如果你在两个不同的分支中，**对同一个文件的同一个部分进行了不同的修改**，Git 就没法干净的合并它们，就产生了冲突。

合并过程中出现`CONFLICT`提升，表示有冲突

```sh
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

使用`git status`查看未合并状态。

任何因包含合并冲突而有待解决的文件，都会以未合并状态标识出来。 **Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。** 出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：

```html
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

你需要**手动解决冲突**，解决了所有文件里的冲突之后，对每个文件**使用 `git add` 命令**来将其标记为冲突已解决。 **一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决**。

如果你对结果感到满意，并且确定之前有冲突的的文件都已经暂存了，这时你可以输入 `git commit` 来完成合并提交。

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8AGit%E3%80%8B%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/20.%E6%96%87%E6%A1%A3%E7%AC%94%E8%AE%B0/30.Git%E5%88%86%E6%94%AF%E7%9A%84%E6%96%B0%E5%BB%BA%E4%B8%8E%E5%90%88%E5%B9%B6-%E5%88%86%E6%94%AF%E6%93%8D%E4%BD%9C.md) 的 `docs/《Git》学习笔记/20.文档笔记/30.Git分支的新建与合并-分支操作.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
