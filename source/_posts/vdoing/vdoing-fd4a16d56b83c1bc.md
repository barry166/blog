---
title: 比typeof运算符更准确的类型判断
date: "2020-04-13 15:56:54"
categories:
  - 前端
  - JavaScript文章
tags:
author: xugaoyi
vdoing_source: docs/01.前端/25.JavaScript文章/100.比typeof运算符更准确的类型判断.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# 比typeof运算符更准确的类型判断

不同数据类型的`Object.prototype.toString`方法返回值如下。

- 数值：返回`[object Number]`。
- 字符串：返回`[object String]`。
- 布尔值：返回`[object Boolean]`。
- undefined：返回`[object Undefined]`。
- null：返回`[object Null]`。
- 数组：返回`[object Array]`。
- arguments 对象：返回`[object Arguments]`。
- 函数：返回`[object Function]`。
- Error 对象：返回`[object Error]`。
- Date 对象：返回`[object Date]`。
- RegExp 对象：返回`[object RegExp]`。
- 其他对象：返回`[object Object]`。

这就是说，`Object.prototype.toString`可以看出一个值到底是什么类型。

```js
Object.prototype.toString.call(2) // "[object Number]"
Object.prototype.toString.call('') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(Math) // "[object Math]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Array]"
```

利用这个特性，可以写出一个比`typeof`运算符更准确的类型判断函数。

```js
var type = function (o){
    var s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}
type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"
```

在上面这个`type`函数的基础上，还可以加上专门判断某种类型数据的方法。

```js
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp'
].forEach(function (t) {
  type['is' + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});

type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/01.%E5%89%8D%E7%AB%AF/25.JavaScript%E6%96%87%E7%AB%A0/100.%E6%AF%94typeof%E8%BF%90%E7%AE%97%E7%AC%A6%E6%9B%B4%E5%87%86%E7%A1%AE%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%88%A4%E6%96%AD.md) 的 `docs/01.前端/25.JavaScript文章/100.比typeof运算符更准确的类型判断.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
