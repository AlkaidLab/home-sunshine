---
description: 为基地虚拟屏选择 Zako Direct 或 WGC，安装并启用 RTX HDR、DLSS NR，区分全局许可、应用默认和当前串流控制。
---

# 捕获与 NVIDIA 画质增强

本页面向已完成普通串流的 Windows 主机。Zako Direct 负责取得画面，RTX HDR 与 DLSS NR 则在编码前处理画面；它们与[客户端插帧](../clients/advanced-video.md#frame-generation)是不同阶段。

## 选择 Zako Direct 或窗口捕获 {#capture}

1. 使用基地虚拟屏时，在 Sunshine 视频设置中找到 **强制指定捕获方法**，选择 **Zako Direct**，保存并重新连接。
2. 查看日志，确认实际捕获路径与编码器。该路径在可用时借用 GPU 帧减少拷贝，但存在复制与 Desktop Duplication 回退，不能仅凭设置项断言正在零拷贝。
3. 对比同一场景的捕获／编码耗时、丢帧和 GPU 负载，再决定是否保留。

需要单窗口时选择 **Windows Graphics Capture（WGC）** 和窗口捕获目标，填写对应窗口标题。WGC 窗口捕获需要用户模式，SYSTEM 服务模式不能直接使用；先确认主机运行方式，再测试窗口显示、最小化和退出行为。AMD Display Capture 不用于基地虚拟屏。

黑屏或捕获初始化失败时，撤销窗口目标并恢复自动捕获，连接 Desktop 对照；不要同时更换编码器和显示策略。

## 准备增强组件 {#components}

RTX HDR、DLSS NR 需要对应 NVIDIA 硬件、驱动、运行组件与当前捕获路径。能正常使用 NVENC 并不等于两项增强一定可用。

1. 打开桌面 GUI 的 **画质增强／画质增强管理**，查看各功能状态。
2. 在 **安装与维护** 中使用 **安装并配置**，按界面提示准备匹配组件；出现需要配置或不支持时，先处理具体提示。
3. 检查 **允许串流使用** 对应功能。它是许可开关，不代表某个应用或正在传输的画面已增强。
4. 打开 **应用**，编辑一个已能正常启动的项目，先记录原来的增强选项。

教程依据的 GUI 来自主机固定的桌面面板快照，独立更新 GUI 或组件后应核对入口与状态。手动替换 DLL 不作为通用安装步骤。

## 将 SDR 转为 HDR：RTX HDR {#rtx-hdr}

1. 先完成[客户端 HDR 与亮度设置](./hdr.md)，确认终端能呈现普通 HDR。
2. 在主机启用 RTX HDR 使用许可，再到目标应用的 **RTX HDR** 设置中开启；初次不修改额外强度参数。
3. 重新连接该应用，用 SDR 内容检查主机增强状态与终端输出。应用配置在下次连接生效，不能只在现有会话中勾选后判断结果。
4. 与关闭时比较暗部、高光和 GPU 处理耗时，确认没有增加无法接受的延迟。

RTX HDR 用于 SDR 转 HDR，不重复处理原生 HDR／HLG 输入。画面过曝或异常时关闭该应用的 RTX HDR 并重连；再恢复普通 HDR 或 SDR 对照。

## 增强画面细节：DLSS NR {#dlss-nr}

1. 在 **画质增强管理** 中确认 DLSS NR 组件已就绪、允许使用。
2. 在应用设置选择该应用的默认增强行为，保存后开始串流。
3. 到管理页的 **当前串流** 选择正确会话，再切换 **DLSS NR 画面增强**。也可在 **浮层与快捷键** 中配置并显示浮层。
4. 用持续运动和小字细节比较开关效果，同时观察处理耗时和 GPU 余量。首次初始化需要处理后续画面，不要在静止桌面只凭瞬间状态判断。
5. 调整不稳定时降低增强渲染比例或关闭，确认普通画面恢复，再逐项重试。

DLSS NR 可以处理的 SDR／原生 HDR 路径以组件和运行状态为准。若显示“RTX HDR 正在占用增强位置”或“不支持实时切换”，按提示处理，不假设两项能任意叠加。NR 与游戏内 DLSS、客户端超分和帧生成不能混为同一开关。

## 保存范围与回退

区分三层：**全局允许使用 → 应用默认行为 → 当前会话实际效果**。实时调整的保存结果以界面提示为准；应用专属配置可能优先于记住的默认值。保存失败时，当前效果与下一次默认配置也可能不同。

回退先关闭当前增强，再把应用专属设置恢复原值，重连验证；若只想停用功能，关闭许可即可，无需先卸载所有组件。记录失败状态、捕获路径与日志后再看[性能排查](../troubleshooting/performance.md)。

## 参考

- [Foundation：捕获与 NVIDIA 画质增强](https://github.com/AlkaidLab/foundation-sunshine/blob/04d9188a5da6985e6d2423040e8ded903d7f0365/docs/zh-CN/features.md)
- [GUI 增强许可、应用默认与实时控制说明](https://github.com/qiin2333/sunshine-control-panel/blob/6b5b810722fc589558a82d7aa0f5b3b087e540ea/src/renderer/composables/enhancementControls.js)
- [NR 浮层状态与回退提示](https://github.com/qiin2333/sunshine-control-panel/blob/6b5b810722fc589558a82d7aa0f5b3b087e540ea/src/renderer/composables/nrOverlayMessages.js)
