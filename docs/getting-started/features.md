---
description: 按用途查找基地版特色功能，核对 Foundation Sunshine、Android V+、PC V+ 和其他客户端的平台与组件条件。
---

# 功能与平台支持

完成[第一次串流](./index.md)后，从下面选一项增强功能。这里把“在哪里学”和“哪一端需要支持”放在一起；教程均包含开启、验证和恢复方法。

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

本轮核对基线为 Foundation Sunshine **2026.1011**、Android V+ **12.13.0**、PC V+ **6.5.0**，并结合 2026-10-16 的项目文档及桌面 GUI 源码快照。GUI、主机和可选组件有各自的版本，不能只根据一个版本号判断所有扩展都可用。

- **已记录**：项目文档或对应版本实现有依据，仍需满足教程的硬件、权限及协商条件。
- **实验性**：可按教程测试，不作为首次连接的默认配置。
- **待核实**：本手册没有确认该客户端的相同入口与行为，不代表永久不支持。
- **不支持**：已核对的版本或路径明确排除；后续版本需重新核对。

### Android V+ 与 PC V+

下表的扩展均指连接兼容的 **Foundation Sunshine**。普通 Sunshine 可以提供基础串流，不能自动获得所有基地版扩展。

| 功能 | Android V+ 12.13.0 | PC V+ 6.5.0 |
| --- | --- | --- |
| 主机显示控制、麦克风回传 | 已记录 | 已记录 |
| ABR、FEC | 已记录 | 已记录 |
| 文本剪贴板 | 已记录，双向 | 已记录，双向 |
| 图片剪贴板 | 已记录，本机图片发往主机 | 已记录，双向 PNG 图片 |
| 主机文件访问 | 待核实，不套用 PC 菜单 | 已记录；本轮 GUI 只读共享 |
| 王冠与社区布局 | 已记录 | 待核实，不套用 Android 操作 |
| USB 设备转发 | 实验性；ARMv7 实机支持仍待验证 | 待核实，不把 USB 隧道实现等同于完整操作入口 |
| PyroWave | 实验性 Vulkan 路径 | 本手册未核实发行包中的相同入口 |
| PyroWave 动态 HDR／帧生成 | 该版本不支持 | 待核实 |
| 客户端插帧 | 实验性；普通支持路径，需设备检查与引擎 | 本手册未提供相同操作教程 |

### 其他系统与客户端

| 项目 | 已核对的起点 | 增强功能如何判断 |
| --- | --- | --- |
| PC V+ 的 Windows／macOS／Linux 包 | [下载、架构与运行库](../clients/desktop.md) | 同一项目也会受系统挂载、驱动和硬解能力限制 |
| macOS Enhanced | [独立客户端安装](../clients/desktop.md#macos) | 不继承 PC V+ 或 Android 的菜单、快捷键与扩展清单 |
| 鸿蒙 NEXT V+ | [安装与显示能力](../clients/harmony-apple.md#鸿蒙-next) | 项目记录了 HLG／HDR Vivid 等方向，具体设备与路径仍需验证 |
| VoidLink／其他 Apple 客户端 | [iPhone、iPad 与 Apple TV](../clients/harmony-apple.md#apple-devices) | 动态 HDR、麦克风及高级反馈分别按所选应用说明确认 |
| 普通 Moonlight | 对应平台的基础串流 | 不能将“能配对”视为支持剪贴板、USB、超级指令等扩展 |

## 开启后如何确认

每次只增加一项功能，保存原配置。先看主机的组件与当前会话状态，再看客户端的实际格式、性能数据或外设行为，最后测试断开重连及结束后的恢复。菜单有开关、能力检测通过、主机宣布已注入元数据，分别都不能替代实际效果验证。

找不到入口时，先核对项目名、版本和教程标注的平台；[故障排查](../troubleshooting/index.md)保留了普通 SDR 对照配置。无需为了尝试所有功能同时安装全部组件。

## 依据与维护

- [Foundation 功能说明快照](https://github.com/AlkaidLab/foundation-sunshine/blob/04d9188a5da6985e6d2423040e8ded903d7f0365/docs/zh-CN/features.md)
- [Android 12.13.0 功能指南](https://github.com/qiin2333/moonlight-vplus/blob/v12.13.0/docs/VPLUS_FEATURES.md)与[兼容说明](https://github.com/qiin2333/moonlight-vplus/blob/v12.13.0/docs/COMPATIBILITY.md)
- [PC V+ 6.5.0 增强说明](https://github.com/qiin2333/moonlight-qt/blob/v6.5.0/README.md)

本页是文档与实现核对，不是所有设备的实测认证；最早支持版本没有充分依据时保持待核实。更新依据见仓库中的 `docs/maintenance/manual-audit.json`。
