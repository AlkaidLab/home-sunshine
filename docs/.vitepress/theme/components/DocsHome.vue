<script setup>
import { withBase } from 'vitepress'
import DocIcon from './DocIcon.vue'
import sunshineGirl from '../../../assets/branding/sunshine-girl.png'

const guides = [
  {
    name: 'play',
    tag: '快速开始',
    title: '第一次串流，从这里开始',
    text: '准备设备、安装和 PIN 配对，让画面、声音与操作顺利连接。',
    link: '/getting-started/',
    foot: '跟着步骤，完成连接',
  },
  {
    name: 'server',
    tag: '服务端',
    title: '准备好你的游戏电脑',
    text: '安装 Sunshine，配置游戏库、虚拟显示器、音频和远程网络。',
    link: '/server/',
    foot: 'Sunshine 配置指南',
  },
  {
    name: 'devices',
    tag: '客户端',
    title: '找到适合你的游玩方式',
    text: '在手机、平板、电视或电脑上，选择客户端并调整串流画质。',
    link: '/clients/',
    foot: 'Moonlight 设备指南',
  },
  {
    name: 'tools',
    tag: '故障排查',
    title: '让串流重新流畅起来',
    text: '连接失败、黑屏、卡顿或没有声音？按遇到的现象逐步排查。',
    link: '/troubleshooting/',
    foot: '从问题找到解决方法',
  },
]
const topics = [
  ['虚拟显示器', '/server/display.html'],
  ['画质与 HDR', '/clients/settings.html'],
  ['外网访问', '/server/network.html'],
  ['连接与配对', '/troubleshooting/connection.html'],
]
</script>

<template>
  <div class="docs-home">
    <section class="docs-hero" aria-labelledby="docs-title">
      <div class="hero-copy">
        <p class="hero-eyebrow"><span></span> 瑶光流梦 · 文档中心</p>
        <h1 id="docs-title">游戏的下一站，<br /><em>由你决定。</em></h1>
        <p class="hero-description">
          从游戏电脑到手边的屏幕。<br />在这里，开始串流、探索设置，让每一次游玩更自在。
        </p>
        <div class="hero-actions">
          <a class="docs-button primary" :href="withBase('/getting-started/')"
            >开始第一次串流 <DocIcon name="arrow"
          /></a>
          <a class="docs-button secondary" :href="withBase('/clients/')"
            >选择客户端 <DocIcon name="devices"
          /></a>
        </div>
        <div class="hero-topics">
          <span>常用内容</span
          ><a v-for="[label, link] in topics" :key="link" :href="withBase(link)">{{ label }}</a>
        </div>
      </div>
      <div class="stream-visual" aria-hidden="true">
        <div class="visual-caption">
          <span class="status-dot"></span> 太阳娘陪你，完成第一次串流 <DocIcon name="spark" />
        </div>
        <div class="monitor">
          <div class="monitor-screen">
            <div class="scene-grid"></div>
            <div class="scene-orbit"></div>
            <div class="scene-sun"></div>
            <div class="scene-hill hill-back"></div>
            <div class="scene-hill hill-front"></div>
            <img class="hero-sunshine-girl" :src="sunshineGirl" alt="" width="156" height="156" />
            <span class="screen-label">PLAY BEYOND.</span>
          </div>
          <div class="monitor-chin"><span></span></div>
          <div class="monitor-stand"></div>
        </div>
        <div class="stream-connection"><span></span><DocIcon name="arrow" /><span></span></div>
        <div class="device-strip">
          <div>
            <DocIcon name="server" /><span>游戏电脑<small>Sunshine</small></span>
          </div>
          <span class="connection-line"></span>
          <div>
            <DocIcon name="devices" /><span>你的设备<small>Moonlight</small></span>
          </div>
        </div>
        <span class="visual-corner corner-top"></span
        ><span class="visual-corner corner-bottom"></span>
      </div>
    </section>

    <section class="guide-section" aria-labelledby="guide-title">
      <div class="section-heading">
        <div>
          <p class="section-kicker">一步一步，找到你的节奏</p>
          <h2 id="guide-title">你想从哪里开始？</h2>
        </div>
        <span class="section-note">四个章节，一份完整的使用指南</span>
      </div>
      <div class="guide-grid">
        <a
          v-for="(guide, index) in guides"
          :key="guide.link"
          class="guide-card"
          :href="withBase(guide.link)"
        >
          <div class="guide-card-top">
            <span class="guide-icon"><DocIcon :name="guide.name" /></span
            ><span class="guide-number">0{{ index + 1 }}</span>
          </div>
          <p class="guide-tag">{{ guide.tag }}</p>
          <h3>{{ guide.title }}</h3>
          <p class="guide-description">{{ guide.text }}</p>
          <div class="guide-card-footer">
            <span>{{ guide.foot }}</span
            ><DocIcon name="arrow" />
          </div>
        </a>
      </div>
    </section>

    <section class="docs-rescue" aria-labelledby="rescue-title">
      <div class="rescue-icon"><DocIcon name="tools" /></div>
      <div>
        <h2 id="rescue-title">遇到问题，也有路可循。</h2>
        <p>先找到现象，再检查设置。我们把常见问题整理在了一起。</p>
      </div>
      <a :href="withBase('/troubleshooting/')">查看故障排查 <DocIcon name="arrow" /></a>
    </section>

    <section class="articles-section" aria-labelledby="articles-title">
      <div class="section-heading">
        <div>
          <p class="section-kicker">不止于使用</p>
          <h2 id="articles-title">走近瑶光的开发现场</h2>
        </div>
        <span class="section-note">开发手记与技术公告</span>
      </div>
      <div class="article-grid">
        <a class="article-card" :href="withBase('/dolby-vision-dev-journal-zh.html')"
          ><span class="article-category">开发手记 · 显示与画质</span>
          <h3>杜比视界：从元数据到原生输出</h3>
          <p>沿着真实的适配过程，了解原生输出与设备黑屏的排查思路。</p>
          <span class="article-read">阅读文章 <DocIcon name="arrow" /></span
        ></a>
        <a class="article-card" :href="withBase('/razer-haptics-sdk-announcement-zh.html')"
          ><span class="article-category">技术公告 · 操作与反馈</span>
          <h3>手柄支持与自研触觉 SDK</h3>
          <p>探索触觉支持的技术路线，以及更多设备的扩展方向。</p>
          <span class="article-read">阅读文章 <DocIcon name="arrow" /></span
        ></a>
      </div>
    </section>
    <div class="docs-home-footer">
      <span>每一次连接，都离游戏更近一点。</span>
      <div>
        <a href="https://docs.lizardbyte.dev/projects/sunshine/latest/">Sunshine 上游文档 ↗</a
        ><a href="https://github.com/AlkaidLab/foundation-sunshine/issues">问题反馈 ↗</a>
      </div>
    </div>
  </div>
</template>
