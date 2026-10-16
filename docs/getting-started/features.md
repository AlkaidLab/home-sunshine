---
description: 按用途查找基地版特色功能，了解 Foundation Sunshine、Android V+、PC V+ 和其他客户端的平台与组件条件。
---

# 功能与平台支持

完成[第一次串流](./index.md)后，从下面选一项增强功能。按使用场景选择教程，并先确认主机、客户端和组件条件。各章提供配置、验证和恢复步骤。

## 按你想做的事查找

| 我想…… | 教程 | 配套条件 |
| --- | --- | --- |
| 没有显示器也能串流，或让电脑熄屏 | [虚拟屏与显示配置](../server/display.md) | Windows 主机、ZakoDisplay 与显示控制 |
| 分别为手机和电视调好 HDR | [HDR、动态格式与校准](../server/hdr.md) | 主机、客户端、解码路径和屏幕共同支持 |
| 将 SDR 转为 HDR，或增强画面细节 | [RTX HDR、DLSS NR 与捕获](../server/enhancements.md) | 对应 NVIDIA 硬件、驱动与增强组件 |
| 改善弱网稳定性 | [ABR 与 FEC](../clients/settings.md#自动码率与丢包保护-fec) | 兼容主机与客户端的网络反馈 |
| 分开控制主机渲染尺寸和传输尺寸 | [渲染与串流分辨率](../clients/settings.md#render-resolution) | 支持该请求的客户端与主机 |
| 在手机上摆放、导入或分享游戏按键 | [王冠与触控操作](../clients/crown.md) | Android V+；布局需适配游戏与屏幕 |
| 使用自适应扳机、体感或高级触觉 | [手柄与 DualSense](../clients/controllers.md) | 游戏、虚拟设备组件及实体连接路径 |
| 把手机麦克风用于电脑游戏语音 | [麦克风回传](../server/audio-input.md#把客户端麦克风传回主机) | 录音权限、主机麦克风通道与设备 |
| 复制文字和图片，读取主机文件 | [剪贴板与文件共享](../server/collaboration.md) | 配对身份与对应扩展；文件共享教程以 PC V+ 为例 |
| 把手机接入的 USB 外设交给电脑 | [USB 设备转发](../server/collaboration.md#usb-forwarding) | Android V+、Windows 主机和 USB/IP 组件；实验性 |
| 用串流菜单执行主机操作 | [超级指令与会话自动化](../server/automation.md) | 主机应用配置与兼容客户端菜单 |
| 用 AI 分析日志，或从浏览器串流 | [AI 与可选集成](../server/integrations.md) | 模型服务或第三方网页组件，分别配置 |
| 尝试 PyroWave 或手机插帧 | [实验视频路径与帧生成](../clients/advanced-video.md) | 设备能力、运行组件及所选路径限制 |

## 如何阅读平台支持

以下说明适用于 Foundation Sunshine **2026.1011**、Android V+ **12.13.0** 和 PC V+ **6.5.0**。主机、桌面控制面板和可选组件分别更新，配置时请同时确认各自版本及组件状态。

- **支持**：所列版本提供对应功能，使用前请确认教程中的硬件、权限与连接条件。
- **实验性**：建议在普通串流稳定后单独测试，并保留原设置以便恢复。
- **兼容性待确认**：该客户端的功能入口或行为尚未确认，请先使用已有指南的路径。
- **不支持**：所列版本或视频路径明确不提供该功能；升级前可查看目标版本说明。

### Android V+ 与 PC V+

下表的扩展均指连接兼容的 **Foundation Sunshine**。普通 Sunshine 可以提供基础串流，不能自动获得所有基地版扩展。

| 功能 | Android V+ 12.13.0 | PC V+ 6.5.0 |
| --- | --- | --- |
| 主机显示控制、麦克风回传 | 支持 | 支持 |
| ABR、FEC | 支持 | 支持 |
| 文本剪贴板 | 支持，双向 | 支持，双向 |
| 图片剪贴板 | 支持，本机图片发往主机 | 支持，双向 PNG 图片 |
| 主机文件访问 | 兼容性待确认 | 支持；桌面控制面板只读共享 |
| 王冠与社区布局 | 支持 | 兼容性待确认 |
| USB 设备转发 | 实验性；ARMv7 实机支持仍待验证 | 兼容性待确认 |
| PyroWave | 实验性 Vulkan 路径 | 兼容性待确认 |
| PyroWave 动态 HDR／帧生成 | 该版本不支持 | 兼容性待确认 |
| 客户端插帧 | 实验性；普通支持路径，需设备检查与引擎 | 暂无对应配置指南 |

### 其他系统与客户端

| 项目 | 安装与入门 | 增强功能如何判断 |
| --- | --- | --- |
| PC V+ 的 Windows／macOS／Linux 包 | [下载、架构与运行库](../clients/desktop.md) | 同一项目也会受系统挂载、驱动和硬解能力限制 |
| macOS Enhanced | [独立客户端安装](../clients/desktop.md#macos) | 使用独立的菜单、快捷键与扩展功能 |
| 鸿蒙 NEXT V+ | [安装与显示能力](../clients/harmony-apple.md#鸿蒙-next) | HLG／HDR Vivid 需配套主机、解码及显示路径，使用前请验证设备兼容性 |
| VoidLink／其他 Apple 客户端 | [iPhone、iPad 与 Apple TV](../clients/harmony-apple.md#apple-devices) | 动态 HDR、麦克风及高级反馈分别按所选应用说明确认 |
| 普通 Moonlight | 对应平台的基础串流 | 剪贴板、USB、超级指令等扩展需另查对应客户端支持范围 |

## 开启后如何确认

每次只增加一项功能，保存原配置。先看主机的组件与当前会话状态，再看客户端的实际格式、性能数据或外设行为，最后测试断开重连及结束后的恢复。设置开关和能力检测可用于准备配置，最终请以实际画面、声音或外设行为确认效果。

找不到入口时，先核对项目名、版本和教程标注的平台；[故障排查](../troubleshooting/index.md)保留了普通 SDR 对照配置。无需为了尝试所有功能同时安装全部组件。

## 参考

- [Foundation Sunshine 功能说明](https://github.com/AlkaidLab/foundation-sunshine/blob/04d9188a5da6985e6d2423040e8ded903d7f0365/docs/zh-CN/features.md)
- [Android 12.13.0 功能指南](https://github.com/qiin2333/moonlight-vplus/blob/v12.13.0/docs/VPLUS_FEATURES.md)与[兼容说明](https://github.com/qiin2333/moonlight-vplus/blob/v12.13.0/docs/COMPATIBILITY.md)
- [PC V+ 6.5.0 增强说明](https://github.com/qiin2333/moonlight-qt/blob/v6.5.0/README.md)
