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

## 部署

官网和文档共用一次完整构建，发布整个 `dist/`。当前 Cloudflare Pages 的配置应保持：

| 项目 | 配置 |
| --- | --- |
| 根目录 | 仓库根目录 |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node.js | 满足 `package.json` 的 `^20.19.0 \|\| >=22.12.0`；使用旧构建镜像或显式 `NODE_VERSION` 时重新核对 |
| 构建变更检测 | 默认检测全部文件；若配置了筛选，应覆盖 `docs/**`、`public/**`、`src/**`、`scripts/**`、依赖锁文件及构建配置 |

独立部署脚本在仓库根目录执行 `npm ci`、`npm run build` 和 `npm test`，成功后发布 `dist/`；不能只运行 `build:client`、`build:docs`，也不能只发布 `dist/docs/`。`dist-ssr/` 是预渲染临时目录，构建后会清理，不是服务端部署包。Cloudflare 自动安装依赖时无需重复安装；若显式启用 `SKIP_DEPENDENCY_INSTALL`，构建命令须自行包含 `npm ci`。

`public/404.html` 会进入发布根目录，关闭 Cloudflare 默认的 SPA 首页回退；`docs/404.html` 由 VitePress 生成，用于文档目录的错误地址。保留这两份文件，确保不存在的路径返回 HTTP 404。新站点已经预渲染为静态页，部署时不需要把所有未知路径重写到 `/index.html`。

Cloudflare Pages 会将 `.html` 请求重定向到无扩展名地址，例如旧文章和 `/docs/clients/settings.html`；这是平台默认行为，旧链接仍可到达对应文章。当前源码保留 `.html` 链接，以兼容普通静态服务器；自建服务器需直接提供现有 HTML／目录索引，文档错误路径使用文档 404。缓存沿用 Pages 默认策略，避免把 HTML 或 `docs/hashmap.json` 设为长期不可变缓存。

参考：[Cloudflare 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[静态路由与 404 行为](https://developers.cloudflare.com/pages/configuration/serving-pages/)、[Node 版本和构建镜像](https://developers.cloudflare.com/pages/configuration/build-image/)。控制台设置未保存在本仓库；上表是部署要求，实际配置需与所用 Pages 项目核对。

## 文档中心

文档中心使用 VitePress 1.6.4 与 Teek 1.6.2，和官网共用根目录的 `package.json`、`package-lock.json` 与 `npm ci`，无需单独安装。根目录的 `overrides` 将 Vue 和 `@vue/shared` 统一到官网所用的 3.6 RC 版本，避免文档主题额外安装另一份 Vue。

```bash
npm run docs:dev     # 本地文档服务，终端会输出 /docs/ 访问地址
npm run build:docs   # 仅构建文档，输出到 dist/docs/
npm run build        # 构建完整官网与文档，统一发布 dist/
npm run preview      # 预览完整构建，包括 /docs/ 与现有文章地址
npm test             # 完整构建后，检查下载逻辑、文档链接、搜索索引与 sitemap
```

Markdown 源文件保存在 `docs/`，文档首页为 `docs/index.md`。已有文章保持原文件名，发布地址仍为 `/docs/dolby-vision-dev-journal-zh.html` 和 `/docs/razer-haptics-sdk-announcement-zh.html`。

新增文档时，添加 Markdown 文件并在开头设置 `description`，正文使用一个一级标题。使用手册的导航维护在 `docs/.vitepress/manual-nav.js`，技术文章导航位于 `docs/.vitepress/config.js`。搜索索引和文档 sitemap 在构建时自动生成；中文搜索使用逐字与相邻双字索引，英文按单词匹配，构建端与浏览器使用同一规则。文档主题和官网共享浅色 / 巧克力深色偏好。

导航与站点配置位于 `docs/.vitepress/config.js`，样式位于 `docs/.vitepress/theme/style.css`。主题入口继承 Teek，`Layout.vue` 定制品牌、双语面包屑和阅读辅助入口，`components/DocsHome.vue` 渲染文档首页。仅使用 Teek 的运行时布局和样式，不启用其自动侧栏、永久链接及文章扫描插件，导航仍由手册配置维护。文档保持 `.html` URL，部署时直接提供 `dist/` 中的静态文件，确保 `/docs/` 使用自己的 `index.html`，无需将文档请求回退到官网首页。根目录的 `robots.txt` 会同时声明官网和文档的 sitemap。

### 文档双语约定

中文沿用 `/docs/`，英文入口为 `/docs/en/`，英文源文件放在 `docs/en/` 的对应目录。目前提供英文首页和快速开始，其余章节在英文导航中标注 `中文`，打开现有中文正文；不生成占位翻译页。搜索索引按语言隔离，英文页面搜索英文内容，需要查完整中文手册时切换中文。语言菜单暂时回到目标语言的文档首页，避免进入未翻译的路径。

新增英文翻译时：

1. 将正文放在对应相对路径，例如 `docs/server/hdr.md` 对应 `docs/en/server/hdr.md`，保留适用条件、核验版本、图片来源和有效链接。共享图片直接引用 `docs/assets/`，不复制素材；界面仍为中文时在英文图注中说明。
2. 在 `src/docs-links.js` 的 `englishDocsPaths` 注册发布路径（目录用 `/getting-started/`，普通页用 `/server/hdr.html`）。官网入口和英文侧栏会选择已发布译文，未翻译链接继续指向中文；canonical 与 `hreflang` 只声明真实存在的译文。
3. 在 `docs/.vitepress/manual-nav.js` 维护双语导航名称，组件文案维护在 `docs/.vitepress/theme/i18n.js`；流程图双语内容位于 `components/ManualDiagram.vue`，VitePress 界面与搜索文案位于 `config.js`。Teek 使用相应语言包。
4. 正文链接指向已翻译页面时使用英文目录内的相对链接；指向中文页面时标注 `中文`。执行 `npm run build && npm test`，检查双语导航、搜索、图片按钮、手机布局及语言切换。

测试会检查翻译注册表与实际英文源文件完全一致、译文对应的中文原文存在、双向语言元信息正确，以及未翻译路径的回退行为。完整手册翻译完成后，可在配置中启用 `i18nRouting`，让原生语言菜单直接切换对应章节。

手册中的 `ManualDiagram` 是随明暗主题适配的流程示意，不冒充软件截图。真实界面图保存在 `docs/assets/manual/`，来源、尺寸和适用范围记录在同目录的 `sources.json`，并在正文图注中说明。更新界面截图时，应使用可核实版本的实机画面，并同步更新来源记录。

配图统一使用以下约束，避免图片抢占阅读空间：

- 实机截图放进 `manual-figure`，宽度不超过正文和 640px；手机设置图使用 `manual-figure-portrait`，小表单使用 `manual-figure-compact`，两者上限均为 480px。保持图片比例，图注放在同一边框内。
- 正文用 `ScreenshotFocus` 展示与步骤有关的区域，保留原图和来源记录；鼠标、触摸或键盘激活重点区域可查看完整截图。不要裁去相关字段名或用装饰插图替代真实设置界面。
- 流程图使用 `ManualDiagram`，根据容器宽度在横排和紧凑竖排之间切换；正文截图、流程图与提示卡片使用统一间距。
- 太阳娘仅用于首页场景、提示标题与阅读辅助入口。首页形象受显示器内框约束，提示头像为 40px（手机 32px），辅助入口为 40px；标记 `no-preview`，不触发原图查看。提示正文始终保留完整行宽，不环绕装饰图。

调整配图与主题后，检查蓝绿／巧克力主题、320px 手机到桌面的布局，以及截图预览、导航、搜索和目录跳转。

主题样式由 `docs/.vitepress/theme/style.css` 按顺序引入 `styles/` 下的 `base.css`、`home.css`、`reading.css`、`responsive.css` 和 `manual.css`，分别维护基础配色／布局、首页、阅读页、响应式及手册视觉组件。修改时保留入口的加载顺序，避免改变样式覆盖关系。

正文使用 `ScreenshotFocus` 展示重点区域：`source-width` 为原图宽度，`regions` 是一个或多个 `[左, 上, 宽, 高]` 原图像素区域。分辨率、帧率等不相邻的选项拆开显示，不拉伸或改写界面文字；点击仍由 Teek 查看完整原图。裁切只影响展示，原始截图与校验值保留。`SunshineTip` 用于有明确入口、适用条件和核验来源的进阶操作，避免重复正文的基础提醒。

2026-10-16 补录了本机 Foundation Sunshine `2026.1015.51059`、桌面 GUI `0.5.8` 的界面：首次设置向导（独立浏览器仅重放显示状态）、PIN 空白表单、虚拟屏概览／显示能力及服务端音视频设置。取图未提交配对、安装驱动、保存或重启服务；PIN 图避开已配对设备列表。Android 旧截图已移除，改用魅族 17 上预装的 V+ `12.12.13.beta.6` 实机串流质量及编码／HDR 设置页，取图未修改客户端配置。该版本为测试机的预发布构建，不标作最新正式版。截图中的本机参数仅作界面示例。太阳娘使用项目原始透明素材，保存在 `docs/assets/branding/`，放在首页、阅读辅助及 `SunshineTip` 提示中，不改绘 IP 形象；来源记录与品牌素材放在一起。

资源按用途放置：`docs/assets/manual/` 只保存正式使用的截图及来源记录，`docs/assets/branding/` 保存文档品牌素材；两者由 Markdown 或 Vue 引用，随构建处理。`public/` 保留官网需要固定地址的公共资源；文档导航标志通过构建引用复用其中同一份图标源文件，独立运行 `docs:dev` 也能显示。`docs/maintenance/` 保存手册核验记录。`output/` 是本地取图、下载和调试产物目录，已加入 Git 忽略规则；构建输出 `dist/`、临时 SSR 输出 `dist-ssr/` 和 VitePress 缓存同样不提交。

### 使用手册的来源与维护

新版手册于 **2026-10-16** 重新编写，首页的使用手册入口指向 `/docs/getting-started/`，特色功能总入口为 `/docs/getting-started/features.html`。按四类任务维护，共 28 页中文手册，另提供英文首页与快速开始：

- `docs/getting-started/`：第一次串流、系统与网络准备、功能与平台支持导航。
- `docs/server/`：安装更新、应用、显示器、HDR 校准、捕获与画质增强、音频输入、剪贴板／文件／USB、自动化、可选集成与远程网络。
- `docs/clients/`：客户端选择、各平台安装、王冠、手柄与高级触觉、画质统计、实验视频与帧生成。
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

本轮内容复核覆盖全部 28 页中文手册及两篇历史技术文章，记录在 [`docs/maintenance/manual-audit.json`](docs/maintenance/manual-audit.json)。复核基线为 Foundation `2026.1011`、Android V+ `12.13.0`、PC V+ `6.5.0`；手势、长按和手柄快捷键还核对了 Android 正式版标签的实现／文案。已修正或补全主机音频控制来源、暂停／退出菜单、FEC 与手动码率、PyroWave 限制、Windows ARM64 获取方式及虚拟屏系统要求的适用范围。macOS Enhanced 的 README 仍写 RC4，而发行页已提供 `v1.3.9-rc.5`，本次架构和资产核对以发行页为准；版本名中的 RC 与 GitHub 的 Pre-release 标记分别记录，不相互推断。

特色功能扩编另核对 Foundation 的 `04d9188` 与其固定 GUI 子模块 `6b5b810`，以及 Android `v12.13.0`、PC `v6.5.0`。9 个新页面包含开启、验证及回退流程；平台表区分已记录、实验性、待核实与明确不支持的路径。文件共享按当前 GUI 的只读范围描述；Android USB 转发与手动 USB/IP 的释放行为分别说明。原来只存在于太阳娘提示中的亮度校准、显示记录、超级指令、渲染比例、触控手势和手柄快捷键已进入正式章节，提示仅保留补充与教程链接。

旧文档中的固定历史下载链接改为当前官方渠道；IddSampleDriver 与手动禁用驱动的说明改为 ZakoDisplay GUI 流程；“所有笔记本都要独显直连”“所有手柄都安装同一旧驱动”“所有设置必须全开”等绝对建议改为按症状定位。每篇手册保留相关项目参考链接，便于继续核对。

测试会递归覆盖全部 Markdown 页面，检查四类导航、内部链接、章节锚点、嵌套目录 canonical、搜索索引、sitemap 和中英文首页的新手册入口。

## 项目结构

```
home-sunshine/
├── docs/               # Markdown 文章与文档首页
│   ├── .vitepress/     # 文档配置、搜索与主题
│   ├── en/             # 英文译文，保持与中文对应的目录结构
│   ├── assets/
│   │   ├── manual/    # 实机截图与来源记录
│   │   └── branding/  # 太阳娘等品牌素材与来源记录
│   └── maintenance/   # 手册内容核验记录
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
