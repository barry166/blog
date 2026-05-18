---
title: new命令原理
date: "2019-12-25 14:27:01"
categories:
  - 前端
  - JavaScript文章
tags:
author: xugaoyi
vdoing_source: docs/01.前端/25.JavaScript文章/02.new命令原理.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# new命令原理

 使用new命令时，它后面的函数依次执行下面的步骤：

1. 创建一个空对象，作为将要返回的实例对象。
2. 将这个空对象的原型，指向构造函数的prototype属性。
3. 将这个空对象赋值给函数内部的this关键字。
4. 开始执行构造函数内部的代码。
5. 如果构造函数内有返回值且为对象类型，则返回该对象，否则返回上面创建的实例对象。

<!-- more -->

```js
// 构造函数
function Person(name,age){
    this.name = name
    this.age = age
}

// 自定义_new
function _new() {
  // 将 arguments 对象转为数组
  var args = [].slice.call(arguments);
  // 取出构造函数
  var constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数，并将context对象赋值给函数内部的this
  var result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context;
}

// 自定义_new2
function _new2(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 创建一个空对象，并继承构造函数的 prototype 属性
  var context = Object.create(constructor.prototype);
  // 执行构造函数，并将context对象赋值给函数内部的this
  var result = constructor.apply(context, params);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context;
  // （当用户在构造函数内部自定义返回对象的话则使用该对象，否则返回context）
}


// 通过自定义_new 返回实例
var actor = _new(Person, '张三', 28);
console.log(actor.name) // 张三

// 通过自定义_new2 返回实例
var actor2 = _new2(Person, ['李四', 29]);
console.log(actor2.name) // 李四

// 通过new命令 返回实例
var actor3 = new Person('王五',30)
console.log(actor3.name) // 王五
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/01.%E5%89%8D%E7%AB%AF/25.JavaScript%E6%96%87%E7%AB%A0/02.new%E5%91%BD%E4%BB%A4%E5%8E%9F%E7%90%86.md) 的 `docs/01.前端/25.JavaScript文章/02.new命令原理.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
