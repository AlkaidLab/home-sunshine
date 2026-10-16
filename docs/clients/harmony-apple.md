---
description: 在 HarmonyOS NEXT、iPhone、iPad 和 Apple TV 上选择兼容客户端，完成本地网络权限、配对和基础串流验证。
---

# 鸿蒙、iPhone 与 Apple TV

这些平台使用各自的应用和系统权限。基础配对流程相同，画质、麦克风、手柄和触觉的菜单及能力则以所选客户端为准。

## 鸿蒙 NEXT

Moonlight V+ for HarmonyOS 当前项目要求 **HarmonyOS NEXT 5.0 或更高版本**。在应用市场搜索 **Moonlight V+**，或打开[应用详情页](https://appgallery.huawei.com/app/detail?id=com.alkaidlab.sdream)。无法唤起市场时，回到设备的应用市场内搜索。

1. 安装并打开应用，让设备与 Sunshine 主机处于同一局域网。
2. 选择发现的主机，或手动添加主机地址。
3. 在 Sunshine 的 PIN 码页面确认配对。
4. 用 SDR、1080p / 60 FPS 和立体声连接 Desktop，验证输入与声音。

支持的设备可继续尝试 HLG / HDR Vivid、主机显示控制等功能，但需要配套服务端和终端支持。客户端性能浮窗提供格式信息时，用它确认实际路径，不只看设置是否勾选。

部分实验性设置可能被当前版本的开发者入口隐藏。普通串流不需要开启这些选项；Android 的 APK、菜单路径和扩展条件也不能直接套到鸿蒙 NEXT。

## iPhone、iPad 与 Apple TV {#apple-devices}

从[官网产品矩阵](https://www.alkaidlab.com/#products)进入适用于自己设备的客户端。官网列有社区项目 **VoidLink**，可查看[中国区商店](https://apps.apple.com/cn/app/voidlink/id6747717070)或[其他地区商店](https://apps.apple.com/us/app/voidlink-extreme/id6755103808)；具体设备、系统、地区和发行方式以当前商店页面为准。

本轮核验的两个 VoidLink 商店页面均列出 iPhone、iPad 和 Apple TV，系统要求分别为 iOS 13、iPadOS 13、tvOS 16 或更高版本。Apple TV 可在电视的 App Store 获取对应版本，无需把早期 TestFlight 教程当作唯一入口。下载时仍需核对所在地区的当前兼容范围。

基地版客户端标为待发布时，不代表社区客户端也不可用；其他客户端的安装方式和功能条件则需分别核对。

1. 首次启动允许**本地网络**访问；此前拒绝过时，回到系统隐私设置检查该应用的权限。
2. 先与主机连同一个可互访的家庭网络，手动添加时填主机 IP。
3. 用 PIN 完成配对，再连接 Desktop。
4. 先测试普通画面、音频和输入，再提高分辨率或开启 HDR。

电视场景还要确认 HDMI 链路、电视画面模式和音频输出设备。手机支持某种格式，不代表电视应用或 HDMI 接收端也支持相同路径。

## 外设与增强功能

实体手柄先在 iOS／iPadOS／tvOS 或鸿蒙本机连接并测试。高级反馈、麦克风回传和动态 HDR 需要所选客户端明确实现，不能仅凭实体手柄或屏幕的型号保证。

找不到主机时先排查本地网络权限和隔离网络；配对后黑屏则按[显示异常排查](../troubleshooting/black-screen.md)从 SDR 与基础编码开始。

## 参考

- [Moonlight V+ for HarmonyOS：安装与使用](https://github.com/AlkaidLab/moonlight-harmony#下载安装)
- [官网产品矩阵](https://www.alkaidlab.com/#products)
