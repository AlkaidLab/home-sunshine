export const manualNavigation = [
  {
    text: '快速开始',
    items: [
      { text: '第一次串流', link: '/getting-started/' },
      { text: '开始前的准备', link: '/getting-started/requirements' },
    ],
  },
  {
    text: '服务端',
    collapsed: false,
    items: [
      { text: '安装、更新与备份', link: '/server/' },
      { text: '添加游戏与应用', link: '/server/apps' },
      { text: '虚拟显示器与熄屏串流', link: '/server/display' },
      { text: '编码、画质与 HDR', link: '/server/video' },
      { text: '声音、麦克风与手柄', link: '/server/audio-input' },
      { text: '外网访问与远程组网', link: '/server/network' },
    ],
  },
  {
    text: '客户端',
    collapsed: false,
    items: [
      { text: '选择与安装客户端', link: '/clients/' },
      { text: 'Android、电视与 Quest', link: '/clients/android' },
      { text: 'Windows、macOS 与 Linux', link: '/clients/desktop' },
      { text: '鸿蒙、iPhone 与 Apple TV', link: '/clients/harmony-apple' },
      { text: '画质设置与性能统计', link: '/clients/settings' },
    ],
  },
  {
    text: '故障排查',
    collapsed: false,
    items: [
      { text: '按症状查找问题', link: '/troubleshooting/' },
      { text: '找不到主机与配对失败', link: '/troubleshooting/connection' },
      { text: '黑屏、503 与显示异常', link: '/troubleshooting/black-screen' },
      { text: '卡顿、丢帧与高延迟', link: '/troubleshooting/performance' },
      { text: '声音、麦克风与手柄异常', link: '/troubleshooting/audio-input' },
      { text: '收集日志与反馈问题', link: '/troubleshooting/logs' },
    ],
  },
]
