<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { useDocsI18n } from '../i18n.js'
import DocIcon from './DocIcon.vue'
import sunshineGirl from '../../../assets/branding/sunshine-girl.png'

const { copy, docPath, languageSuffix } = useDocsI18n()
const home = computed(() => copy.value.home)
const guidePaths = ['/getting-started/', '/server/', '/clients/', '/troubleshooting/']
const guideIcons = ['play', 'server', 'devices', 'tools']
const guides = computed(() =>
  home.value.guides.map(([tag, title, text, foot], index) => ({
    name: guideIcons[index],
    tag,
    title,
    text,
    foot,
    link: guidePaths[index],
  })),
)
const topicPaths = [
  '/getting-started/features.html',
  '/server/display.html',
  '/server/hdr.html',
  '/server/network.html',
  '/troubleshooting/connection.html',
]
const topics = computed(() => home.value.topics.map((label, index) => [label, topicPaths[index]]))
const articlePaths = [
  '/dolby-vision-dev-journal-zh.html',
  '/razer-haptics-sdk-announcement-zh.html',
]
</script>

<template>
  <div class="docs-home">
    <section class="docs-hero" aria-labelledby="docs-title">
      <div class="hero-copy">
        <p class="hero-eyebrow"><span></span> {{ home.eyebrow }}</p>
        <h1 id="docs-title">
          {{ home.title }}<br /><em>{{ home.emphasis }}</em>
        </h1>
        <p class="hero-description">{{ home.description[0] }}<br />{{ home.description[1] }}</p>
        <div class="hero-actions">
          <a class="docs-button primary" :href="withBase(docPath('/getting-started/'))"
            >{{ home.start }} <DocIcon name="arrow"
          /></a>
          <a class="docs-button secondary" :href="withBase(docPath('/clients/'))"
            >{{ home.clients }}{{ languageSuffix('/clients/') }} <DocIcon name="devices"
          /></a>
        </div>
        <div class="hero-topics">
          <span>{{ home.common }}</span
          ><a v-for="[label, link] in topics" :key="link" :href="withBase(docPath(link))"
            >{{ label }}{{ languageSuffix(link) }}</a
          >
        </div>
      </div>
      <div class="stream-visual" aria-hidden="true">
        <div class="visual-caption">
          <span class="status-dot"></span> {{ home.visual }}
          <DocIcon name="spark" />
        </div>
        <div class="monitor">
          <div class="monitor-screen">
            <div class="scene-grid"></div>
            <div class="scene-orbit"></div>
            <div class="scene-sun"></div>
            <div class="scene-hill hill-back"></div>
            <div class="scene-hill hill-front"></div>
            <img
              class="hero-sunshine-girl no-preview"
              :src="sunshineGirl"
              alt=""
              width="156"
              height="156"
            />
            <span class="screen-label">PLAY BEYOND.</span>
          </div>
          <div class="monitor-chin"><span></span></div>
          <div class="monitor-stand"></div>
        </div>
        <div class="stream-connection"><span></span><DocIcon name="arrow" /><span></span></div>
        <div class="device-strip">
          <div>
            <DocIcon name="server" /><span>{{ home.host }}<small>Sunshine</small></span>
          </div>
          <span class="connection-line"></span>
          <div>
            <DocIcon name="devices" /><span>{{ home.device }}<small>Moonlight</small></span>
          </div>
        </div>
        <span class="visual-corner corner-top"></span
        ><span class="visual-corner corner-bottom"></span>
      </div>
    </section>

    <section class="guide-section" aria-labelledby="guide-title">
      <div class="section-heading">
        <div>
          <p class="section-kicker">{{ home.kicker }}</p>
          <h2 id="guide-title">{{ home.guideTitle }}</h2>
        </div>
        <span class="section-note">{{ home.guideNote }}</span>
      </div>
      <p v-if="home.translationNote" class="translation-notice">{{ home.translationNote }}</p>
      <div class="guide-grid">
        <a
          v-for="(guide, index) in guides"
          :key="guide.link"
          class="guide-card"
          :href="withBase(docPath(guide.link))"
        >
          <div class="guide-card-top">
            <span class="guide-icon"><DocIcon :name="guide.name" /></span
            ><span class="guide-number">0{{ index + 1 }}</span>
          </div>
          <p class="guide-tag">{{ guide.tag }}{{ languageSuffix(guide.link) }}</p>
          <h3>{{ guide.title }}</h3>
          <p class="guide-description">{{ guide.text }}</p>
          <div class="guide-card-footer">
            <span>{{ guide.foot }}{{ languageSuffix(guide.link) }}</span
            ><DocIcon name="arrow" />
          </div>
        </a>
      </div>
    </section>

    <section class="docs-rescue" aria-labelledby="rescue-title">
      <div class="rescue-icon"><DocIcon name="tools" /></div>
      <div>
        <h2 id="rescue-title">{{ home.rescueTitle }}</h2>
        <p>{{ home.rescueText }}</p>
      </div>
      <a :href="withBase(docPath('/troubleshooting/'))"
        >{{ home.rescueLink }}{{ languageSuffix('/troubleshooting/') }} <DocIcon name="arrow"
      /></a>
    </section>

    <section class="articles-section" aria-labelledby="articles-title">
      <div class="section-heading">
        <div>
          <p class="section-kicker">{{ home.articlesKicker }}</p>
          <h2 id="articles-title">{{ home.articlesTitle }}</h2>
        </div>
        <span class="section-note">{{ home.articlesNote }}</span>
      </div>
      <div class="article-grid">
        <a
          v-for="([category, title, description], index) in home.articles"
          :key="articlePaths[index]"
          class="article-card"
          :href="withBase(docPath(articlePaths[index]))"
        >
          <span class="article-category"
            >{{ category }}{{ languageSuffix(articlePaths[index]) }}</span
          >
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
          <span class="article-read"
            >{{ home.read }}{{ languageSuffix(articlePaths[index]) }} <DocIcon name="arrow"
          /></span>
        </a>
      </div>
    </section>
    <div class="docs-home-footer">
      <span>{{ home.footer }}</span>
      <div>
        <a href="https://docs.lizardbyte.dev/projects/sunshine/latest/">{{ home.upstream }} ↗</a
        ><a href="https://github.com/AlkaidLab/foundation-sunshine/issues">{{ home.issues }} ↗</a>
      </div>
    </div>
  </div>
</template>
