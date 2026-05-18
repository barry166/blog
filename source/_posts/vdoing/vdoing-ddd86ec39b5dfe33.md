---
title: headers 模块单元测试
date: "2020-01-05 10:56:02"
categories:
  - 《TypeScript 从零实现 axios》
  - ts-axios 单元测试
tags:
  - TypeScript
author: HuangYi
vdoing_source: docs/《TypeScript 从零实现 axios》/11.ts-axios 单元测试/05.headers 模块单元测试.md
vdoing_repo: "https://github.com/xugaoyi/vuepress-theme-vdoing/tree/d77b420"
---
# headers 模块单元测试

之前我们测试了 `headers` 的基础方法模块，接下来我们会从业务角度测试 `headers` 的相关业务逻辑。

## 测试代码编写

`test/headers.spec.ts`：

```typescript
import axios from '../src/index'
import { getAjaxRequest } from './helper'

function testHeaderValue(headers: any, key: string, val?: string): void {
  let found = false

  for (let k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      found = true
      expect(headers[k]).toBe(val)
      break
    }
  }

  if (!found) {
    if (typeof val === 'undefined') {
      expect(headers.hasOwnProperty(key)).toBeFalsy()
    } else {
      throw new Error(key + ' was not found in headers')
    }
  }
}

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should use default common headers', () => {
    const headers = axios.defaults.headers.common

    axios('/foo')

    return getAjaxRequest().then(request => {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(headers[key])
        }
      }
    })
  })

  test('should add extra headers for post', () => {
    axios.post('/foo', 'fizz=buzz')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('should use application/json when posting an object', () => {
    axios.post('/foo/bar', {
      firstName: 'foo',
      lastName: 'bar'
    })

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/json;charset=utf-8')
    })
  })

  test('should remove content-type if data is empty', () => {
    axios.post('/foo')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })

  it('should preserve content-type if data is false', () => {
    axios.post('/foo', false)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('should remove content-type if data is FormData', () => {
    const data = new FormData()
    data.append('foo', 'bar')

    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })
})
```

内部定义了 `testHeaderValue` 辅助函数，用于测试 `headers` 是否存在某个 `header name` 下的某个值。

至此我们完成了 `ts-axios` 库 `headers` 模块相关业务逻辑的测试，下一节课我们会对 `Axios` 的实例做测试。

---

> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/docs/%E3%80%8ATypeScript%20%E4%BB%8E%E9%9B%B6%E5%AE%9E%E7%8E%B0%20axios%E3%80%8B/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/05.headers%20%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md) 的 `docs/《TypeScript 从零实现 axios》/11.ts-axios 单元测试/05.headers 模块单元测试.md`。
> 原作者：HuangYi。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/d77b420/LICENSE)。
