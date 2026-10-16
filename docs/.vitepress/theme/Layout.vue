<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import Teek from 'vitepress-theme-teek'
import { manualNavigation } from '../manual-nav.js'
import DocIcon from './components/DocIcon.vue'
import logo from '../../../public/favicon.webp'
import sunshineGirl from '../../assets/branding/sunshine-girl.png'

const { page } = useData()
const { Layout } = Teek
const section = computed(() =>
  manualNavigation.find((group) =>
    group.items?.some(
      (item) => page.value.relativePath.replace(/index\.md$|\.md$/g, '') === item.link.slice(1),
    ),
  ),
)
const sectionName = computed(
  () =>
    section.value?.text || (page.value.relativePath.includes('journal') ? '开发手记' : '技术公告'),
)
</script>

<template>
  <Layout>
    <template #nav-bar-title-before
      ><img class="docs-brand-mark" :src="logo" alt="" width="30" height="30"
    /></template>
    <template #sidebar-nav-after>
      <a class="sidebar-start" :href="withBase('/getting-started/')"
        ><DocIcon name="play" /><span>从这里开始<small>完成你的第一次串流</small></span
        ><DocIcon name="arrow"
      /></a>
    </template>
    <template #doc-before>
      <nav class="doc-breadcrumb" aria-label="当前位置">
        <a :href="withBase('/')">文档中心</a><span aria-hidden="true">/</span>
        <a v-if="section" :href="withBase(section.items[0].link)">{{ sectionName }}</a
        ><span v-else>{{ sectionName }}</span>
      </nav>
    </template>
    <template #aside-bottom>
      <a class="reading-help" :href="withBase('/troubleshooting/')"
        ><img
          class="reading-mascot no-preview"
          :src="sunshineGirl"
          alt=""
          width="40"
          height="40"
        /><strong>太阳娘陪你排查</strong><span>别着急，我们从现象开始。</span
        ><span class="help-link">打开故障排查 <span aria-hidden="true">↗</span></span></a
      >
    </template>
  </Layout>
</template>
