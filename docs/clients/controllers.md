---
description: 配置 DualSense 虚拟设备、自适应扳机、HD Haptics 与音频模拟振动，验证 Android 手柄快捷键和不同连接路径。
---

# 手柄、DualSense 与高级触觉

先完成[基础手柄输入](../server/audio-input.md#基础手柄输入)。按钮、传统振动、体感、自适应扳机和原生音频触觉是分别验证的能力；不能因为一项正常就推断全部支持。

## 配置主机 DualSense 组件 {#dualsense}

1. 结束活动串流，打开 Windows 主机的 **设备中心 → 控制器**，查看 DualSense 虚拟设备组件状态。
2. 按入口安装匹配组件，等待验证完成；需要修复或重启时先处理对应提示。不要从旧教程随意拼接驱动版本。
3. 在全局虚拟手柄类型或单个应用设置中选择 **DualSense**，保存后重新建立串流。类型变更作用于之后新建的虚拟手柄。
4. 在客户端本机连接实体手柄，确认客户端记录的连接路径（USB、蓝牙或系统输入）和相应权限，再启动支持 DualSense 的游戏。
5. 先验证主机看到正确设备、按钮与摇杆，再分别验证游戏提供的扳机、灯光、触控板或体感功能。

GUI 的普通手柄测试可用于检查设备识别、输入和基础振动，**不能验证 HD Haptics**。游戏也必须自身提供相应效果。

## HD Haptics 与传输组件 {#hd-haptics}

核对的 GUI 将普通手柄功能与 **HD Haptics（四声道）** 分开：普通路径包含按键、摇杆等能力，HD Haptics 还需额外音频设备与可用 USB/IP 共享传输。

1. 在主机组件管理确认共享 USB 驱动已就绪，再查看 **HD Haptics** 是否可用；普通按键正常但该项不可用时，只排查这条附加路径。
2. 按当前组件选择 HD Haptics 能力，重连以创建相应设备；若游戏在设备创建前已启动，完全退出游戏后再打开测试。
3. 使用明确支持原生音频触觉的游戏与客户端路径，测试已知场景，同时确认主机的四声道端点和客户端接收状态。
4. 在同一连接中另测普通 Rumble，区分是整个手柄没有工作，还是只有高级反馈失败。

PC、Android、鸿蒙与 Apple 客户端不自动具有同一反馈通路；USB 和蓝牙也不能互相代替。Android 的[USB 设备转发](../server/collaboration.md#usb-forwarding)是把外设交给主机的另一种路径，不要同时让本地驱动和转发争用同一设备。

无法确认高级路径时先切回普通手柄功能；不要为关闭一种触觉效果直接卸载所有共享 USB 组件，它们还可能用于其他功能。

## 音频模拟振动 {#audio-rumble}

Android V+ 的 **设置 → 音频 → 音频模拟振动输出**根据声音生成手机或手柄振动，不能替代游戏原生 Rumble 或 HD Haptics。

1. 先关闭新增音频模拟，只测试普通游戏振动是否正常。
2. 再开启模拟并选择一个实际支持振动的输出目标；先测试单路，再按需选双路输出或场景模式。
3. 用同一段有明显声音变化的内容对比，检查是否同时叠加了其他振动来源。音频直通与输出处理也可能影响效果。
4. 效果过强、延迟或持续杂振时关闭模拟，回到普通游戏振动；不用通过提高音频音量补偿未知路径。

## Android 手柄快捷操作 {#shortcuts}

- **Select + L1/LB + R1/RB + X**：12.13.0 记录的性能显示切换组合。
- **长按 Start 操作轮盘**：需要启用对应设置；轮盘出现后点按十字键上可打开串流菜单。具体动作按当前输入路径的提示确认。

先使用设置中的 **手柄快捷键测试** 核对按钮映射、连接路径和是否启用长按操作，再进入游戏。测试中识别不到时，用触摸／鼠标直接打开串流菜单，不要持续在游戏中试组合键造成误操作。PC V+ 的退出组合键和手柄鼠标切换使用自己的设置，不能套用 Android 全部组合。

恢复时关闭新增轮盘或还原快捷键配置。按键自动重复、菜单滚动等问题见[音频与输入排查](../troubleshooting/audio-input.md)。

## 参考

- [Foundation：DualSense 与虚拟手柄](https://github.com/AlkaidLab/foundation-sunshine/blob/04d9188a5da6985e6d2423040e8ded903d7f0365/docs/zh-CN/features.md#dualsense-与虚拟手柄)
- [GUI 普通手柄与 HD Haptics 能力说明](https://github.com/qiin2333/sunshine-control-panel/blob/6b5b810722fc589558a82d7aa0f5b3b087e540ea/src/renderer/desktop/i18n/zh.js)
- [Android 12.13.0 快捷键及音频振动文案](https://github.com/qiin2333/moonlight-vplus/blob/v12.13.0/app/src/main/res/values-zh-rCN/strings.xml)
- [PC V+：手柄与悬浮菜单](https://github.com/qiin2333/moonlight-qt/blob/v6.5.0/README.md#客户端体验)
