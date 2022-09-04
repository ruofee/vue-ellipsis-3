<script setup lang="ts">
import { computed, useSlots } from 'vue';
import NativeEllipsis from './components/NativeEllipsis.vue';
import JsEllipsis from './components/JsEllipsis.vue';
import { ELLIPSIS_NODE } from './const';
import { isSupportNativeEllipsis } from './utils/is';
import { getDefaultEndExcludes } from './utils/get';

const slots = useSlots();

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  visibleLine: {
    type: Number,
    default: 1,
  },
  visibleHeight: {
    type: Number,
  },
  maxLine: {
    type: Number,
  },
  maxHeight: {
    type: Number,
  },
  ellipsis: {
    type: Boolean,
    default: true,
  },
  ellipsisNode: {
    type: String,
    default: ELLIPSIS_NODE,
  },
  endExcludes: {
    type: Array,
    default: getDefaultEndExcludes,
  },
  useInnerHtml: {
    type: Boolean,
    default: false,
  },
  reflowOnResize: {
    type: Boolean,
    default: false,
  },
  onReflow: {
    type: Function,
  },
  onEllipsisClick: {
    type: Function,
  },
});

const useNativeEllipsis = computed(() => {
  const useNativeEllipsis =
    isSupportNativeEllipsis &&
    (typeof props.maxLine === 'undefined' || props.maxLine === props.visibleLine) &&
    props.endExcludes.length === 0 &&
    props.ellipsisNode === ELLIPSIS_NODE &&
    typeof slots.ellipsisNode === 'undefined' &&
    typeof props.maxHeight === 'undefined' &&
    typeof props.visibleHeight === 'undefined' &&
    typeof props.onReflow === 'undefined' &&
    typeof props.onEllipsisClick === 'undefined';
  return useNativeEllipsis;
});
</script>

<template>
  <div class="vue-ellipsis">
    <NativeEllipsis
      v-if="useNativeEllipsis"
      :text="props.text"
      :visible-line="props.visibleLine"
      :ellipsis="props.ellipsis"
      :use-inner-html="props.useInnerHtml"
    />
    <JsEllipsis
      v-else
      :text="text"
      :use-inner-html="useInnerHtml"
      :visible-line="visibleLine"
      :visible-height="visibleHeight"
      :max-line="maxLine"
      :max-height="maxHeight"
      :ellipsis="ellipsis"
      :end-excludes="endExcludes"
      :reflow-on-resize="reflowOnResize"
      :on-reflow="onReflow"
      :on-ellipsis-click="onEllipsisClick"
    >
      <template #ellipsisNode>
        <template v-if="!slots.ellipsisNode">{{ ellipsisNode }}</template>
        <slot name="ellipsisNode"></slot>
      </template>
    </JsEllipsis>
  </div>
</template>

<style scoped></style>
