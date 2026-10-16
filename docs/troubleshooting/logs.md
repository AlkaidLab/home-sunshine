---
description: 保存 Sunshine 和客户端在同一时间段的日志与性能统计，按设备、版本、复现步骤和网络条件提交有效问题反馈。
---

# 收集日志与反馈问题

提交反馈时，请说明设备、版本、配置、操作步骤和实际结果。重启或重装前先保存故障现场，下面的清单可以帮助我们更快定位。

## 收集同一次故障

1. 记下发生时间，保留原始错误文字或截图。
2. 在 Sunshine 桌面控制面板的日志／故障排除入口保存对应时段日志。
3. 在客户端提供的日志、诊断或性能报告入口导出材料；只有截图入口时，保存性能浮窗和错误提示。
4. 说明问题出现于发现、配对、启动应用，还是串流进行中。
5. 记录恢复到基础配置后是否仍发生，以及只连接 Desktop 时是否正常。

各平台的导出入口不同，请使用当前客户端提供的日志或诊断入口。发生后先保留材料，避免多次重启覆盖关键上下文。

## 可以直接填写的模板

```text
主机：Windows 版本、CPU、GPU、显卡驱动版本
Sunshine：版本、正式版/测试版、安装版/便携版
客户端：项目名称、版本、设备型号、系统版本
网络：主机有线/无线；客户端网络；局域网/组网/公网；是否中继
参数：分辨率、FPS、码率、编码、HDR、音频格式
显示：物理屏/虚拟屏、所选显示策略
输入：有问题时补充手柄型号、USB/蓝牙、虚拟手柄类型

复现步骤：
1.
2.
3.

预期结果：
实际结果与原始报错：
发生时间：
基础配置与 Desktop 是否仍复现：
最近是否更新软件、驱动或修改设置：
已尝试的单项调整及结果：
附件：对应时段的脱敏日志、性能统计、必要截图
```

## 发布前检查附件

日志与截图可能带有用户名、路径、IP、主机名和应用信息。保留排查所需的错误和上下文，但遮盖私人内容；不要上传 PIN、管理密码、配对证书、组网密钥或整份配置／客户端备份。

遮盖敏感值时，请保留错误行及相邻上下文。能用最短操作复现时，提供这组步骤比上传长时间录屏更有效。

## 选择反馈位置

- 服务端、显示器和主机组件问题：[Foundation Sunshine Issues](https://github.com/AlkaidLab/foundation-sunshine/issues)。
- 仅 Android V+ 复现：[Moonlight V+ Issues](https://github.com/qiin2333/moonlight-vplus/issues)。
- 仅 PC V+ 复现：[PC 客户端 Issues](https://github.com/qiin2333/moonlight-qt/issues)。
- 其他客户端：使用对应项目或商店提供的支持入口；也可从[官网](https://www.alkaidlab.com/#stream-guide)进入社区。

不确定归属时，先完整说明两端信息和对照结果，不必提前猜测根因。

## 可选：使用 AI 日志诊断

桌面 GUI 提供模型配置和日志分析辅助，步骤见[AI 日志诊断](../server/integrations.md#ai-diagnosis)。先保留原始日志和复现时间，再核对模型建议；它不替代实际验证，也不是提交问题的前提。

## 参考

- [Foundation Sunshine：FAQ 与反馈](https://github.com/AlkaidLab/foundation-sunshine/blob/master/docs/zh-CN/faq.md)
- [Moonlight V+：问题反馈所需信息](https://github.com/qiin2333/moonlight-vplus/blob/master/docs/USER_GUIDE.md#提交问题)
