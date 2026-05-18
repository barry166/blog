---
title: vuex操作相关
date: "2020-02-04 13:15:19"
categories:
  - 《Vue》笔记
  - 规模化
tags:
  - Vue
author: xugaoyi
vdoing_source: docs/《Vue》笔记/06.规模化/100.vuex操作相关.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# vuex操作相关

```js
import { mapActions, mapMutations, mapGetters } from 'vuex'

computed: {
    ...mapGetters([ // 获取数据，内部为数组
        'searchHistory' // 相当于在data插入searchHistory和获取到的数据
    ])
},

methods: {
	某方法(){
	  this.saveSearchHistory(传入值)
	},
	...mapActions([ // 提交actions修改数据，内部为数组 因为actions文件已对方法进行了封装所有是数组类型
      'saveSearchHistory' // 相当于在methods绑定了事件saveSearchHistory
    ]),

	某方法() {
		this.setFullScreen(传入值)
	},
	 ...mapMutations({ // 提交mutations，内部为对象
      setFullScreen: 'SET_FULL_SCREEN' // 相当于在methods绑定了事件setFullScreen
    })
}

```

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8AVue%E3%80%8B%E7%AC%94%E8%AE%B0/06.%E8%A7%84%E6%A8%A1%E5%8C%96/100.vuex%E6%93%8D%E4%BD%9C%E7%9B%B8%E5%85%B3.md) 的 `docs/《Vue》笔记/06.规模化/100.vuex操作相关.md`。
> 原作者：xugaoyi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
