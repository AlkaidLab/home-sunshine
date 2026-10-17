<script setup>
import sunshineGirl from '../../../assets/branding/sunshine-girl.webp'
import { useDocsI18n } from '../i18n.js'

defineProps({ title: { type: String, default: '' } })
const { copy } = useDocsI18n()
</script>

<template>
  <aside class="sunshine-tip" role="note">
    <div class="sunshine-tip-heading">
      <img class="no-preview" :src="sunshineGirl" alt="" width="40" height="40" loading="lazy" />
      <p class="sunshine-tip-title">{{ title || copy.tip }}</p>
    </div>
    <div class="sunshine-tip-body"><slot /></div>
  </aside>
</template>
