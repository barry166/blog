# Barry's Blog

基于 [Hexo](https://hexo.io/) 和 [Butterfly](https://butterfly.js.org/) 主题搭建的个人技术博客。

## 技术栈

- **框架**: Hexo 7.3.0
- **主题**: Butterfly 5.5.4
- **部署**: Vercel

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地服务 (localhost:4000)
npm run server

# 生成静态文件
npm run build

# 清除缓存
npm run clean
```

## 写作

```bash
# 新建文章
npx hexo new post "文章标题"

# 新建草稿
npx hexo new draft "草稿标题"

# 发布草稿
npx hexo publish "草稿标题"
```

## 目录结构

```
├── source/
│   ├── _posts/        # 文章
│   ├── about/         # 关于页面
│   ├── categories/    # 分类页面
│   ├── tags/          # 标签页面
│   ├── css/           # 自定义样式
│   └── js/            # 自定义脚本
├── scaffolds/         # 文章模板
├── _config.yml        # Hexo 主配置
├── _config.butterfly.yml  # 主题配置
└── vercel.json        # Vercel 部署配置
```

## 部署

推送到 `main` 分支后，Vercel 会自动构建部署。

## License

文章内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议。
