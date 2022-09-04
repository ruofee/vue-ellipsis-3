<script setup lang="ts">
const text = '这是一段非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的话';
</script>

<template>
  <div id="app">
    <div class="ellipsis-wrapper">
      <VueEllipsis3 :visible-line="1" :text="text" ellipsis-node="...." reflowOnResize />
    </div>
  </div>
</template>

<style scoped>
.ellipsis-wrapper {
  width: 400px;
  resize: horizontal;
  overflow: hidden;
  padding: 10px 12px;
  border-radius: 4px;
  background-color: #eee;
}
#app {
  width: 200px;
  line-height: 16px;
}
</style>
