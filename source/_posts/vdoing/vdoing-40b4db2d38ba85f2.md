---
title: JS随机打乱数组
date: "2020-02-08 17:42:03"
categories:
  - 前端
  - JavaScript文章
tags:
author: xugaoyi
vdoing_source: docs/01.前端/25.JavaScript文章/50.js随机打乱数组.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# JS随机打乱数组

```js
function shuffle(arr) { // 随机打乱数组
  let _arr = arr.slice() // 调用数组副本，不改变原数组
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
function getRandomInt(min, max) { // 获取min到max的一个随机数，包含min和max本身
  return Math.floor(Math.random() * (max - min + 1) + min)
}
```

<!-- ## vue demo
```html

```html
&lt;template>
  <div>
    原数组：{{arr}}
    <button @click="clickBut">click me！打乱数组</button></br></br>
    打乱结果：{{result}}
  </div>
&lt;/template>

&lt;script>
  export default {
    data(){
      return {
        arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        result: []
      }
    },
    methods:{
      clickBut(){
        this.result = this.shuffle(this.arr)
      },
      shuffle(arr) { // 随机打乱数组
        let _arr = arr.slice() // 调用数组副本，不改变原数组
        for (let i = 0; i < _arr.length; i++) {
          let j = this.getRandomInt(0, i)
          let t = _arr[i]
          _arr[i] = _arr[j]
          _arr[j] = t
        }
        return _arr
      },
      getRandomInt(min, max) { // 获取min到max的一个随机数，包含min和max本身
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
    }
  }
&lt;/script>
```
--- -->


--- demo [vanilla]
```html
<html>
  原数组：<span id="span1"></span>
  <button id="btn">click me！打乱数组</button> </br></br>
  打乱结果：<span id="span2"></span>
</html>
&lt;script>
    function getRandomInt(min, max) { // 获取min到max的一个随机数，包含min和max本身
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function shuffle(arr) { // 随机打乱数组
      let _arr = arr.slice() // 调用数组副本，不改变原数组
      for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
      }
      return _arr
    }

    //使用
    function $(el){
      return document.querySelector(el)
    }
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const $span2 = $('#span2');

    $('#span1').textContent = arr;
    $('#btn').onclick = function () {
      $span2.textContent = shuffle(arr);
    }
  &lt;/script>
```
```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/01.%E5%89%8D%E7%AB%AF/25.JavaScript%E6%96%87%E7%AB%A0/50.js%E9%9A%8F%E6%9C%BA%E6%89%93%E4%B9%B1%E6%95%B0%E7%BB%84.md) 的 `docs/01.前端/25.JavaScript文章/50.js随机打乱数组.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
