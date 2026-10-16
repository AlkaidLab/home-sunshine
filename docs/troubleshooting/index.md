---
description: 从找不到主机、PIN 失败、503、黑屏、卡顿、无声音和手柄异常等症状定位 Sunshine 与 Moonlight 问题。
---

# 按症状查找问题

<SunshineTip title="太阳娘的手柄暗号：快速切换性能统计">
  <p>Android V+ 的手柄快捷键可用 <strong>Select + L1/LB + R1/RB + X</strong> 切换性能显示。支持“长按 Start 操作轮盘”的版本，还能长按 Start 调出轮盘，再点按十字键上打开串流菜单。</p>
  <p>先在客户端设置的“手柄快捷键测试”中验证当前设备与输入路径；长按 Start 功能需要开启。不确定按键映射时，直接从串流菜单打开统计。</p>
  <a class="tip-source" href="https://github.com/qiin2333/moonlight-vplus/blob/v12.13.0/app/src/main/res/values-zh-rCN/strings.xml#L313-L376">查看正式版快捷键与测试入口 ↗</a>
</SunshineTip>

先描述“在哪一步、发生了什么”，再改设置。安装、发现主机、PIN 配对、启动应用和持续串流是不同阶段，解决方法也不同。

## 选择你的症状

| 现象 | 先看这里 |
| --- | --- |
| 没有发现电脑、手动添加失败 | [连接与配对](./connection.md) |
| PIN 不成功、换设备后不能连接 | [PIN 配对失败](./connection.md#pin-配对失败) |
| 在家能用，外网不能用 | [远程连接](./connection.md#remote-access) |
| 配对成功，启动时黑屏或报 503 | [黑屏与显示异常](./black-screen.md) |
| 虚拟屏创建失败、退出后本地屏异常 | [显示策略与恢复](./black-screen.md#虚拟屏与退出恢复) |
| 卡顿、丢帧、画面卡住或操作迟缓 | [性能排查](./performance.md) |
| 画面正常但无声、麦克风无电平 | [声音与麦克风](./audio-input.md) |
| 手柄没反应、反馈异常、菜单自动滚动 | [输入与反馈](./audio-input.md#手柄无输入或反馈不正确) |
| 已排查仍复现 | [收集日志并反馈](./logs.md) |

## 用一套基础配置复现

先断开当前串流，再在客户端使用 **1080p / 60 FPS、10 Mbps、SDR、自动或 H.264、立体声 / Opus**。关闭额外超分、帧生成和画质增强，然后连接 **Desktop**。

- 基础配置正常：逐项恢复原设置，找出开始异常的那一项。
- Desktop 正常、只有游戏异常：查游戏启动、捕获对象和游戏本身。
- 局域网正常、外网异常：优先查远程网络路径。
- 基础配置也失败：记下时间和报错，查看对应服务端及客户端日志。

## 避免让问题更难还原

一次改一项，并记下原值。先保留应用、配对和配置，再考虑重装；不要把清空配置、卸载虚拟显示器、关闭全部防火墙或强行切显卡作为所有问题的通用解法。

当前手册按公开文档和发行信息编写。涉及特定机型、驱动或新组件的问题，还需要双方版本、日志和复现步骤才能判断。

## 参考

- [Foundation Sunshine FAQ](https://github.com/AlkaidLab/foundation-sunshine/blob/master/docs/zh-CN/faq.md)
- [Foundation Sunshine 发行说明](https://github.com/AlkaidLab/foundation-sunshine/releases)
