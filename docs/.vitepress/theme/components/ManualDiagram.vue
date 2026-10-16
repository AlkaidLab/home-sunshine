<script setup>
import { computed } from 'vue'
import DocIcon from './DocIcon.vue'

const props = defineProps({ kind: { type: String, required: true } })
const diagrams = {
  streaming: {
    title: '一次串流，两端配合',
    caption: '连接示意：画面与声音从主机传向客户端，客户端把操作传回主机。',
    items: [
      {
        icon: 'server',
        label: '游戏电脑',
        name: 'Sunshine 服务端',
        text: '运行游戏，采集并编码画面与声音。',
      },
      {
        icon: 'arrow',
        label: '家庭网络',
        name: '先在同一局域网连接',
        text: '主机优先接网线，客户端靠近路由器。',
      },
      {
        icon: 'devices',
        label: '游玩设备',
        name: 'Moonlight 客户端',
        text: '显示画面、播放声音，并将操作传回去。',
      },
    ],
  },
  pairing: {
    title: 'PIN 在哪边看，在哪边填？',
    caption: '配对流程示意，非软件截图。PIN 由客户端显示，在主机端输入。',
    items: [
      {
        icon: 'devices',
        label: '01 · 客户端',
        name: '选择主机，查看 PIN',
        text: 'Moonlight 显示本次配对码，保持页面打开。',
      },
      {
        icon: 'server',
        label: '02 · 游戏电脑',
        name: '输入 PIN 并发送',
        text: '在 Sunshine 的 PIN 码页面填写客户端显示的码。',
      },
      {
        icon: 'play',
        label: '03 · 回到客户端',
        name: '打开应用列表',
        text: '确认配对成功，再选择 Desktop 验证连接。',
      },
    ],
  },
  display: {
    title: '先决定屏幕怎么用，再选择显示策略',
    caption: '显示策略示意：以下是使用目的，不是界面中固定的选项名称。',
    items: [
      {
        icon: 'server',
        label: '普通串流',
        name: '采集物理屏',
        text: '物理屏保持开启，客户端观看所选屏幕。',
      },
      {
        icon: 'devices',
        label: '扩展副屏',
        name: '物理屏 ＋ 虚拟屏',
        text: '保留本地桌面，把虚拟屏用于远程画面。',
      },
      {
        icon: 'play',
        label: '仅虚拟屏',
        name: '只启用目标虚拟屏',
        text: '物理屏不参与桌面，结束后验证显示布局恢复。',
      },
    ],
  },
  latency: {
    title: '卡顿发生在哪一段？',
    caption: '画面传输链路示意。统计字段的定义不同，不能直接相加当作完整操作延迟。',
    items: [
      {
        icon: 'server',
        label: '主机',
        name: '运行 → 捕获 → 编码',
        text: '先确认游戏本地帧率，再看捕获和编码是否跟得上。',
      },
      {
        icon: 'arrow',
        label: '网络',
        name: '传输与接收',
        text: '关注丢帧、抖动、拥塞，以及外网是否经过中继。',
      },
      {
        icon: 'devices',
        label: '客户端',
        name: '解码 → 渲染 → 显示',
        text: '确认硬件解码，检查设备温度、帧节奏和屏幕处理。',
      },
    ],
  },
}
const diagram = computed(() => diagrams[props.kind])
</script>

<template>
  <figure v-if="diagram" class="manual-diagram" :class="`diagram-${kind}`">
    <p class="manual-diagram-title">{{ diagram.title }}</p>
    <ol class="manual-diagram-steps">
      <li v-for="item in diagram.items" :key="item.label">
        <DocIcon :name="item.icon" />
        <span class="diagram-label">{{ item.label }}</span>
        <strong>{{ item.name }}</strong>
        <p>{{ item.text }}</p>
      </li>
    </ol>
    <figcaption>{{ diagram.caption }}</figcaption>
  </figure>
</template>
