---
description: 按 Android、Windows、macOS、Linux、鸿蒙、iPhone 和 Apple TV 选择 Moonlight 客户端，找到匹配的安装包和首次连接步骤。
---

# 选择与安装客户端

Sunshine 安装在运行游戏的电脑上，Moonlight 安装在观看和操作的设备上。同一套主机可以配对不同设备，但各客户端提供的扩展功能并不完全相同。

## 按设备选择

| 设备 | 客户端与获取方式 | 继续阅读 |
| --- | --- | --- |
| Android 手机、平板 | [Moonlight V+ APK](https://github.com/qiin2333/moonlight-vplus/releases/latest) | [Android 指南](./android.md) |
| Android TV、电视盒子 | 同一项目的 Android 安装包，按设备解码能力设置 | [电视与盒子](./android.md#tv-and-quest) |
| Quest | 从 Android 客户端项目核对当前设备兼容与安装方式 | [Quest 使用](./android.md#tv-and-quest) |
| Windows | [Moonlight V+ for PC](https://github.com/qiin2333/moonlight-qt/releases/latest)：x64 安装程序／ARM64 便携包，按处理器选择 | [桌面客户端](./desktop.md#windows) |
| macOS | [Moonlight V+ for PC](https://github.com/qiin2333/moonlight-qt/releases/latest) 或 [macOS Enhanced](https://github.com/skyhua0224/moonlight-macos-enhanced/releases) | [Mac 与架构选择](./desktop.md#macos) |
| Linux | [Moonlight V+ for PC](https://github.com/qiin2333/moonlight-qt/releases/latest) 对应架构 AppImage | [Linux 安装](./desktop.md#linux) |
| Steam Link 设备 | PC 项目发行页中的 Steam Link 包 | [Steam Link](./desktop.md#steam-link) |
| HarmonyOS NEXT | 应用市场中的 [Moonlight V+](https://appgallery.huawei.com/app/detail?id=com.alkaidlab.sdream) | [鸿蒙指南](./harmony-apple.md#鸿蒙-next) |
| iPhone、iPad、Apple TV | VoidLink：[中国区](https://apps.apple.com/cn/app/voidlink/id6747717070)／[其他地区](https://apps.apple.com/us/app/voidlink-extreme/id6755103808)商店 | [Apple 设备](./harmony-apple.md#apple-devices) |

标为“待发布”的基地版客户端暂未提供下载，现阶段可选择产品矩阵中列出的社区客户端。应用商店地区、系统支持与收费以对应发行页为准。

## 每个平台都先做这几步

1. 核对包的处理器架构、最低系统要求和发行通道。
2. 安装后允许所需的本地网络访问权限。
3. 与主机接入同一局域网，添加主机并完成 PIN 配对。
4. 先用 1080p / 60 FPS、10–20 Mbps、SDR 和立体声连接 Desktop。

完整流程见[第一次串流](../getting-started/index.md)。

## 标准串流和增强功能

普通 Moonlight / Sunshine 协议可以提供基础画面、声音和输入。麦克风回传、主机显示控制、实时调码率、剪贴板、文件映射和高级触觉等功能，需要主机与客户端都实现对应扩展。

菜单没有出现或功能回退时，先检查双方版本和对应平台的功能说明。Android、Apple 和鸿蒙的菜单与扩展范围各不相同，升级前可先查看[功能与平台支持](../getting-started/features.md)。

## 参考

- [Foundation Sunshine：控制端列表](https://github.com/AlkaidLab/foundation-sunshine#控制端moonlight)
- [Moonlight V+：功能兼容说明](https://github.com/qiin2333/moonlight-vplus/blob/master/docs/COMPATIBILITY.md)
