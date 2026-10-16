---
description: 在局域网验证成功后配置远程虚拟组网，区分主机地址、管理地址、直连与中继，并排查外网连不上或带宽不足。
---

# 外网访问与远程组网

先在家中完成[第一次串流](../getting-started/index.md)，再测试外网。`192.168.x.x`、`10.x.x.x` 等家中局域网地址不能直接代表主机在互联网中的可达地址。

## 推荐起点：两端加入同一虚拟网络

对于不准备维护公网端口的用户，可使用 EasyTier、Tailscale 等组网工具，让客户端能访问主机的虚拟地址。

1. 在主机和客户端分别安装、登录或配置所选组网工具。
2. 按工具的说明加入同一受控网络；使用网络名称和密钥的工具，应核对双方配置。
3. 在工具中确认主机在线，记下分配给**主机**的虚拟 IP。
4. 在 Moonlight 手动添加这个虚拟 IP，按 PIN 流程配对或连接。
5. 先用 1080p / 60 FPS、10 Mbps 测试，再根据路径质量调高。

自动发现没有跨越虚拟网络，不代表组网失败。能看到节点在线也不代表串流所需的通信已放行，还要检查访问规则与 Windows 防火墙。

Android Moonlight V+ 提供应用内 EasyTier 入口；其他平台是否内置相同工具应看具体客户端。没有内置入口时，使用该平台支持的独立组网应用，不要套用 Android 的菜单路径。

## 直连与中继的区别

组网连接可能直接在两端间传输，也可能经过中继。中继路径、跨运营商链路和主机上传拥塞都可能提高延迟或限制带宽。

在组网工具中查看实际路径，再结合客户端性能统计判断。若外网不稳，先降低码率，保留上传带宽余量；不要仅凭家中宽带的下载速率设定外网串流码率。

## 如果你已经有公网方案

端口映射、IPv6 和防火墙规则需要与你实际使用的 Sunshine 版本、端口配置、路由器及客户端匹配。根据主机的实际端口配置逐项放行，不要为方便而把整个主机放进路由器 DMZ。

Sunshine 的 `47990` 是管理 WebUI 的默认端口，不是要填入 Moonlight 的完整连接地址。**不要把管理 WebUI 暴露到公网**。需要高级网络部署时，按 [Sunshine 官方文档](https://docs.lizardbyte.dev/projects/sunshine/latest/)和对应组网工具说明配置。

## 远程使用前确认

- 主机不会睡眠，Sunshine 随所选运行方式正常启动。
- 两端的组网连接和访问权限可用。
- 已在外部网络真正测试过，而不只是连接家中 Wi-Fi 测试。
- 若要远程修改显示器、驱动或运行模式，保留一个已验证的恢复途径。

Wake-on-LAN 不是所有跨网方案都自动支持的能力；不要把“已开启唤醒”当成外出后一定能开机的保证。

在家能连、外面不行时，见[连接排查](../troubleshooting/connection.md#remote-access)；已连接但卡顿时，见[性能排查](../troubleshooting/performance.md)。

## 参考

- [Moonlight V+：远程网络与 EasyTier](https://github.com/qiin2333/moonlight-vplus/blob/master/docs/USER_GUIDE.md#远程网络与-easytier)
- [Tailscale 官方快速开始](https://tailscale.com/docs/how-to/quickstart)
- [EasyTier 项目与文档入口](https://github.com/EasyTier/EasyTier)
