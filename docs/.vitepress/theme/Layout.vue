<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import Teek, { en } from 'vitepress-theme-teek'
import { manualNavigation, englishManualNavigation } from '../manual-nav.js'
import { useDocsI18n } from './i18n.js'
import DocIcon from './components/DocIcon.vue'
import logo from '../../../public/favicon.webp'
import sunshineGirl from '../../assets/branding/sunshine-girl.png'

const { page } = useData()
const { Layout } = Teek
const { copy, locale, docPath, languageSuffix } = useDocsI18n()
const section = computed(() =>
  (locale.value === 'en' ? englishManualNavigation : manualNavigation).find((group) =>
    group.items?.some(
      (item) => page.value.relativePath.replace(/index\.md$|\.md$/g, '') === item.link.slice(1),
    ),
  ),
)
const sectionName = computed(
  () =>
    section.value?.text ||
    (page.value.relativePath.includes('journal') ? copy.value.journal : copy.value.announcement),
)
</script>

<template>
  <Layout :locale="locale === 'en' ? en : undefined">
    <template #nav-bar-title-before
      ><img class="docs-brand-mark" :src="logo" alt="" width="30" height="30"
    /></template>
    <template #sidebar-nav-after>
      <a class="sidebar-start" :href="withBase(docPath('/getting-started/'))"
        ><DocIcon name="play" /><span
          >{{ copy.start }}<small>{{ copy.startDetail }}</small></span
        ><DocIcon name="arrow"
      /></a>
    </template>
    <template #doc-before>
      <nav class="doc-breadcrumb" :aria-label="copy.breadcrumb">
        <a :href="withBase(docPath('/'))">{{ copy.center }}</a
        ><span aria-hidden="true">/</span>
        <a v-if="section" :href="withBase(section.items[0].link)">{{ sectionName }}</a
        ><span v-else>{{ sectionName }}</span>
      </nav>
    </template>
    <template #aside-bottom>
      <a class="reading-help" :href="withBase(docPath('/troubleshooting/'))"
        ><img
          class="reading-mascot no-preview"
          :src="sunshineGirl"
          alt=""
          width="40"
          height="40"
        /><strong>{{ copy.help }}</strong
        ><span>{{ copy.helpDetail }}</span
        ><span class="help-link"
          >{{ copy.helpLink }}{{ languageSuffix('/troubleshooting/') }}
          <span aria-hidden="true">↗</span></span
        ></a
      >
    </template>
  </Layout>
</template>
