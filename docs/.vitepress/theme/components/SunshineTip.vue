<script setup>
import sunshineGirl from '../../../assets/branding/sunshine-girl.png'

defineProps({ title: { type: String, default: '太阳娘的进阶技巧' } })
</script>

<template>
  <aside class="sunshine-tip" role="note">
    <div class="sunshine-tip-heading">
      <img class="no-preview" :src="sunshineGirl" alt="" width="40" height="40" loading="lazy" />
      <p class="sunshine-tip-title">{{ title }}</p>
    </div>
    <div class="sunshine-tip-body"><slot /></div>
  </aside>
</template>
