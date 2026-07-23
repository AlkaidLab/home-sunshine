# 瑶光流梦官网

基于 Vue 3 + Vite 构建的 瑶光流梦 官方网站。

## 项目介绍

这是 瑶光流梦 的官方网站项目，从 [sunshine-control-panel](https://github.com/qiin2333/sunshine-control-panel) 的 `src/renderer/home` 目录迁移而来，使用最新的 Vue 3 + Vite 技术栈重新构建。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Less** - CSS 预处理器

## 功能特性

- 🌐 中英文双语支持
- 📱 响应式设计，支持移动端和桌面端
- ⚡ 快速加载和流畅的动画效果
- 🎨 现代化的 UI 设计
- 📊 GitHub Star History 图表展示
- 🔄 自动检查最新版本

## 开发

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
pnpm build
# 或
yarn build
```

### 预览生产构建

```bash
npm run preview
# 或
pnpm preview
# 或
yarn preview
```

## 静态文档

Markdown 文档放在 `docs/` 目录中，生产构建会自动生成对应的静态 HTML 页面并输出到 `dist/docs/`：

```bash
npm run build:docs
```

首页的“文档与支持”区域可以直接链接这些页面。当前已接入雷蛇手柄触觉支持公告：
`docs/razer-haptics-sdk-announcement-zh.md`。

## 项目结构

```
home-sunshine/
├── src/
│   ├── App.vue          # 主应用组件
│   ├── main.js          # 应用入口文件
│   ├── i18n.js          # 多语言翻译配置
│   └── styles/          # 样式文件
│       ├── variables.less    # Less 变量
│       ├── mixins.less      # Less 混入
│       └── global.less      # 全局样式
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json         # 项目配置
```

## 许可证

本项目基于原项目修改，遵循原项目的许可证。
