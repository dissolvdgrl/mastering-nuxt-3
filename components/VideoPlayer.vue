<template>
  <iframe
      width="560"
      height="315"
      :src="`https://player.vimeo.com/video/${props.videoId}`"
      title="Video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gryroscope;"
      allowfullscreen
  />
</template>

<script lang="ts" setup>
  const props = defineProps({
    videoId: {
      type: Number,
      required: true
    }
  });
</script>
