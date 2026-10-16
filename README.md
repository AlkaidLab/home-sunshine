# 瑶光流梦官网

基于 Vue 3 + Vite 构建的 瑶光流梦 官方网站。

## 项目介绍

这是 瑶光流梦 的官方网站项目，从 [sunshine-control-panel](https://github.com/qiin2333/sunshine-control-panel) 的 `src/renderer/home` 目录迁移而来，使用最新的 Vue 3 + Vite 技术栈重新构建。

## 技术栈

- **Vue 3.6.0-rc.11** - 使用 Vapor 模式，运行时、服务端渲染器与编译器保持同一版本
- **Vite 8** - 前端构建工具，保留原有浏览器构建目标
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

需要 Node.js `^20.19.0 || >=22.12.0`。项目使用根目录的 `package.json` 和 `package-lock.json` 管理依赖，CI 或复现构建使用 `npm ci`。

官网已经使用 Vue 3.6 的 Vapor 模式，因此跟随 3.6 预发布版本升级，并锁定 Vue 相关包的版本；当前 RC 版本尚非稳定版，不能直接替换为 npm `latest` 标签对应的 3.5 稳定线。

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 文档中心

文档中心使用 VitePress 1.6.4，和官网共用根目录的 `package.json`、`package-lock.json` 与 `npm ci`，无需单独安装。根目录的 `overrides` 将 Vue 和 `@vue/shared` 统一到官网所用的 3.6 RC 版本，避免文档主题额外安装另一份 Vue。

```bash
npm run docs:dev     # 本地文档服务，终端会输出 /docs/ 访问地址
npm run build:docs   # 仅构建文档，输出到 dist/docs/
npm run build        # 构建完整官网与文档，统一发布 dist/
npm run preview      # 预览完整构建，包括 /docs/ 与现有文章地址
npm test             # 完整构建后，检查下载逻辑、文档链接、搜索索引与 sitemap
```

Markdown 源文件保存在 `docs/`，文档首页为 `docs/index.md`。已有文章保持原文件名，发布地址仍为 `/docs/dolby-vision-dev-journal-zh.html` 和 `/docs/razer-haptics-sdk-announcement-zh.html`。

新增文档时，添加 Markdown 文件并在开头设置 `description`，正文使用一个一级标题。使用手册的导航维护在 `docs/.vitepress/manual-nav.js`，技术文章导航位于 `docs/.vitepress/config.js`。搜索索引和文档 sitemap 在构建时自动生成；中文搜索使用逐字与相邻双字索引，英文按单词匹配，构建端与浏览器使用同一规则。文档主题和官网共享浅色 / 巧克力深色偏好。

导航与站点配置位于 `docs/.vitepress/config.js`，样式位于 `docs/.vitepress/theme/style.css`。文档保持 `.html` URL，部署时直接提供 `dist/` 中的静态文件，确保 `/docs/` 使用自己的 `index.html`，无需将文档请求回退到官网首页。根目录的 `robots.txt` 会同时声明官网和文档的 sitemap。

### 使用手册的来源与维护

新版手册于 **2026-10-16** 重新编写，首页的使用手册入口指向 `/docs/getting-started/`。按四类任务维护，共 19 页：

- `docs/getting-started/`：第一次串流、系统与网络准备。
- `docs/server/`：安装更新、应用、显示器、画质、音频输入与远程网络。
- `docs/clients/`：客户端选择、各平台安装与画质统计。
- `docs/troubleshooting/`：连接、黑屏／503、性能、音频输入及日志反馈。

已阅读[旧腾讯文档入口](https://docs.qq.com/aio/DSGdQc3htbFJjSFdO?p=YTpMj5JNNdB5hEKJhhqlSB)、其中的《Sunshine基地版使用手册初版》和《丸子君的新基地尊享版教程》主页面。它们用于确认迁移主题；旧截图、附属视频、历史网盘和安装命令未原样搬运。感谢旧版教程与社区资料的贡献者。

| 本轮核验材料 | 核验范围 |
| --- | --- |
| [Foundation 正式版 2026.1011](https://github.com/AlkaidLab/foundation-sunshine/releases/tag/v2026.1011.150654.%E6%9D%82%E9%B1%BC)，提交 `f0ec742` | 实际安装包、虚拟屏系统要求、已记录的 NVIDIA 驱动问题 |
| [Foundation 文档快照 `04d9188`](https://github.com/AlkaidLab/foundation-sunshine/tree/04d9188a5da6985e6d2423040e8ded903d7f0365/docs/zh-CN) 与同提交 README | 桌面 GUI、PIN、应用、ZakoDisplay、HDR、设备组件、更新与排障 |
| [Android V+ 文档快照 `799f50d`](https://github.com/qiin2333/moonlight-vplus/tree/799f50d6e7bd288cd69fe6df2081c9d9502c45b4/docs)，正式包 `v12.13.0` | 首次连接、王冠、麦克风、备份与兼容条件 |
| [PC V+ README 快照 `817da6f`](https://github.com/qiin2333/moonlight-qt/blob/817da6f993229e4e316031e14c7a0bed18cdf17c/README.md)，正式包 `v6.5.0` | 桌面客户端架构、AppImage 运行库、便携版迁移与协作功能 |
| [鸿蒙 README 快照 `2caa429`](https://github.com/AlkaidLab/moonlight-harmony/blob/2caa42936a4bd3ef89a1fb17b85fcfe7b1becb65/README.md) | NEXT 系统要求、应用市场与平台差异 |
| [macOS Enhanced 发行页](https://github.com/skyhua0224/moonlight-macos-enhanced/releases)（当时最新为 `v1.3.9-rc.5`）及项目 README；VoidLink 当前商店页面 | Mac 架构与客户端选择、Apple 设备发行入口；预发布不等同于正式版 |

核验方式为公开文档、发行资产和源码入口检查，**不代表已在所有硬件上实测**。手册不填未经核实的最低功能版本；组件、动态 HDR、触觉等能力写明双方条件，具体发布情况以目标发行说明为准。后续更新先核实发行包与 UI，再改步骤、链接及验证日期。

旧文档中的固定历史下载链接改为当前官方渠道；IddSampleDriver 与手动禁用驱动的说明改为 ZakoDisplay GUI 流程；“所有笔记本都要独显直连”“所有手柄都安装同一旧驱动”“所有设置必须全开”等绝对建议改为按症状定位。每篇手册保留相关项目参考链接，便于继续核对。

测试会递归覆盖全部 Markdown 页面，检查四类导航、内部链接、章节锚点、嵌套目录 canonical、搜索索引、sitemap 和中英文首页的新手册入口。

## 项目结构

```
home-sunshine/
├── docs/               # Markdown 文章与文档首页
│   └── .vitepress/     # 文档配置、搜索与主题
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
