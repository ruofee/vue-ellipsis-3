<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
  },
  visibleLine: {
    type: Number,
  },
  ellipsis: {
    type: Boolean,
  },
  useInnerHtml: {
    type: Boolean,
  },
});
</script>

<template>
  <div
    :class="['vue-ellipsis-native', { ellipsis: props.ellipsis }]"
    :style="{ webkitLineClamp: props.visibleLine } as any"
  >
    <span v-if="props.useInnerHtml" v-html="props.text" class="vue-ellipsis-native-html" />
    <span v-else class="vue-ellipsis-native-text">{{ props.text }}</span>
  </div>
</template>

<style scoped>
.vue-ellipsis-native.ellipsis {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  -webkit-box-orient: vertical;
}
</style>
