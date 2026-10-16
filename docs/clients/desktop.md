---
description: 安装 Moonlight V+ for PC 或 macOS Enhanced，选择正确架构，并处理 Windows 便携版、Linux AppImage 与桌面输入模式。
---

# Windows、macOS 与 Linux

桌面设备可用来串流游戏，也可远程操作 Windows 桌面。安装前先区分操作系统、处理器架构，以及自己使用的是 PC V+ 还是 macOS Enhanced。

## Windows

从 [Moonlight V+ for PC 正式发行页](https://github.com/qiin2333/moonlight-qt/releases/latest)选择 VPlus 安装程序。普通用户优先用安装版；确实需要多套独立配置或便携部署时再选 ZIP。

**PC V+ 6.5.0** 提供 x64 安装程序与 ARM64 便携包：常见 Intel / AMD 电脑选择 x64，Windows on ARM 设备选择 ARM64。

安装后启动客户端，允许适用的网络访问，添加主机并完成 PIN 配对，再用 Desktop 测试。键鼠先在客户端本机正常使用，进入串流后区分游戏的相对鼠标模式与桌面的直接鼠标模式。

### 便携版更新

将新版解压到新目录，再迁移原目录中的 `Moonlight Game Streaming Project` 设置文件夹，并保留原目录以便回退。请保留新版自带的 Qt 插件；残留的不兼容 `tls/qopensslbackend.dll` 可能导致启动崩溃。

## macOS

| 选择 | 当前发行与架构注意事项 |
| --- | --- |
| Moonlight V+ for PC | 当前预编译 DMG 为 Apple Silicon（arm64）；Intel Mac 不能直接使用该包 |
| Moonlight macOS Enhanced | 独立的 macOS 客户端；发行页提供 universal、arm64、x86_64 等包时，按实际 Mac 选择，不确定可选 universal |

从 [PC V+](https://github.com/qiin2333/moonlight-qt/releases/latest) 或 [macOS Enhanced](https://github.com/skyhua0224/moonlight-macos-enhanced/releases) 获取 DMG，打开后按安装说明将应用放入“应用程序”。Enhanced 要求 macOS 12 或更高版本，下载前请确认目标发行版的系统要求。

首次启动允许**本地网络**访问。系统拦截应用时，先核对来源，再按该项目的安装说明处理，不要全局关闭系统安全设置。

两个项目的菜单与快捷键不同。Enhanced 使用 `Ctrl + Option` 释放鼠标、`Ctrl + Option + C` 打开全屏控制中心；PC V+ 请查看自己的快捷键设置。

## Linux

PC V+ 6.5.0 提供 x86_64 和 aarch64 AppImage。x86_64 包需要 glibc 2.35 或更新版本，aarch64 包需要 glibc 2.39 或更新版本。下载前请同时确认处理器架构、Linux 发行版和运行库版本。

把 AppImage 保存到自己的目录，使用文件属性中的权限选项赋予可执行权限后启动。需要用终端时，可在文件所在目录运行以下示例，替换为实际文件名：

```bash
chmod +x ./Moonlight-VPlus-版本-x86_64.AppImage
./Moonlight-VPlus-版本-x86_64.AppImage
```

若报告运行库缺失、架构错误或硬件解码不可用，记录完整报错，并按该发行版要求处理。不要用来历不明的系统库替换系统文件。

上游 Moonlight 的 Flatpak、Snap 或发行版软件源也可能适合基础串流，但不应默认认为它们包含 V+ 的扩展。

## Steam Link

使用 PC 项目发行页中明确标记为 Steam Link 的包，并按该项目或设备的安装说明部署。它不是 Windows 安装程序，也不是 Linux 桌面 AppImage。

首次同样从 1080p / 60 FPS、SDR 和立体声开始，先验证输入、声音和实际解码能力。

## 串流中的操作

PC V+ 的悬浮菜单可按版本提供全屏、性能统计、鼠标、麦克风和主机文件等入口。办公时使用适合桌面的鼠标模式；游戏时再锁定／捕获指针。

剪贴板、主机文件映射、麦克风和显示控制需要兼容的 Foundation Sunshine。只授权确实需要的目录或设备，并确认服务端相应功能已开启。

文字／图片双向测试、主机只读文件夹共享和撤销步骤见[桌面协作教程](../server/collaboration.md)。远程显示配置见[虚拟显示器](../server/display.md)，支持的增强范围见[功能与平台支持](../getting-started/features.md)。

## 参考

- [Moonlight V+ for PC：下载与兼容性](https://github.com/qiin2333/moonlight-qt#下载)
- [macOS Enhanced：安装与快速开始](https://github.com/skyhua0224/moonlight-macos-enhanced#快速开始)
