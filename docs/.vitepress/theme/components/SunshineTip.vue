<script setup>
import sunshineGirl from '../../../assets/branding/sunshine-girl.png'

defineProps({ title: { type: String, default: '太阳娘的进阶技巧' } })
</script>

<template>
  <aside class="sunshine-tip" role="note">
    <img :src="sunshineGirl" alt="" width="72" height="72" loading="lazy" />
    <div>
      <p class="sunshine-tip-title">{{ title }}</p>
      <div class="sunshine-tip-body"><slot /></div>
    </div>
  </aside>
</template>
