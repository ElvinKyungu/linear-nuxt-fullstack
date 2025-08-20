<script setup lang="ts">
defineProps({
  strokeColor: {
    type: String,
    default: '#facc15',
  },
  transformStatus: {
    type: String,
    default: 'rotate(-90 7 7)',
  },
})
</script>
<template>
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle
      cx="7"
      cy="7"
      r="6"
      fill="none"
      :stroke="strokeColor"
      stroke-width="2"
      stroke-dasharray="3.14 0"
      stroke-dashoffset="-0.7"
    />
    <circle
      class="progress"
      cx="7"
      cy="7"
      r="2"
      fill="none"
      :stroke="strokeColor"
      stroke-width="4"
      stroke-dasharray="2.0839231268812295 100"
      stroke-dashoffset="0"
      :transform="transformStatus"
    />
  </svg>
</template>
