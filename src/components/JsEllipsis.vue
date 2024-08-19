<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { isSupportResizeObserver, isRegExp, isString } from '../utils/is';
import { getLineHeight, registerWordBreak, setWordBreak, binarySearch } from '../utils/compute';
import { getElementHeight, wrapTextChildNodesWithSpan } from '../utils/dom';
import { getDefaultEndExcludes } from '../utils/get';

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
  },
  endExcludes: {
    type: Array,
    default: getDefaultEndExcludes,
  },
  useInnerHtml: {
    type: Boolean,
  },
  reflowOnResize: {
    type: Boolean,
  },
  onReflow: {
    type: Function,
  },
  onEllipsisClick: {
    type: Function,
  },
  onUnellipsisClick: {
    type: Function,
  },
});

const aref = ref<HTMLElement>();
const textRef = ref<HTMLElement>();
const ellipsisRef = ref<HTMLElement>();
const unellipsisRef = ref<HTMLElement>();

const truncating = ref<boolean>();
const observer = ref<ResizeObserver>();

watch(() => props.text, reflow);
watch(() => props.ellipsis, reflow);
watch(() => props.useInnerHtml, reflow);
watch(() => props.maxLine, reflow);
watch(() => props.visibleLine, reflow);
watch(() => props.maxHeight, reflow);
watch(() => props.visibleHeight, reflow);
watch(() => props.endExcludes, reflow);

function handleOnReflow(ellipsis: boolean, result: string): void {
  props?.onReflow?.(ellipsis, result);
}

// callback of ellipsis click event
function handleEllipsisClick() {
  props?.onEllipsisClick?.();
}

function handleUnellipsisClick() {
  props?.onUnellipsisClick?.();
}

function reflow(): void {
  if (!aref.value || !textRef.value || !ellipsisRef.value || truncating.value) {
    return;
  }
  ellipsisRef.value.style.display = 'none';
  if (props.useInnerHtml) {
    textRef.value.innerHTML = props.text;
  } else {
    textRef.value.innerText = props.text;
  }
  if (!props.ellipsis) {
    return;
  }
  const lineHeight = getLineHeight(aref.value);
  const wordBreak = registerWordBreak(textRef.value);
  const visibleMaxHeight =
    typeof props.visibleHeight === 'undefined' ? lineHeight * props.visibleLine : props.visibleHeight;
  const maxHeight =
    typeof props.maxHeight === 'undefined'
      ? typeof props.maxLine === 'undefined'
        ? visibleMaxHeight
        : lineHeight * props.maxLine
      : props.maxHeight;
  const height = getElementHeight(aref.value);
  // content will be truncated if the content's height bigger than Math.max(maxHeight, visibleMaxHeight).
  if (height <= Math.max(maxHeight, visibleMaxHeight)) {
    handleOnReflow(false, props.text);
    if (isString(wordBreak)) {
      setWordBreak(textRef.value, wordBreak);
    }
    return;
  }
  truncating.value = true;
  ellipsisRef.value.style.display = 'inline';
  if (unellipsisRef.value) {
    unellipsisRef.value.style.display = 'none';
  }
  if (props.useInnerHtml) {
    // wrap the text children node with span element.
    wrapTextChildNodesWithSpan(textRef.value);
    truncateHTML(aref.value, textRef.value, visibleMaxHeight);
  } else {
    truncateText(aref.value, textRef.value, visibleMaxHeight);
  }
  if (unellipsisRef.value) {
    unellipsisRef.value.style.display = 'inline';
  }
  if (isString(wordBreak)) {
    setWordBreak(textRef.value, wordBreak);
  }
  truncating.value = false;
}

function truncateText(container: HTMLElement, textContainer: HTMLElement, max: number) {
  const text = textContainer.textContent || '';
  let currentText = '';
  // Binary truncate text until get the max limit fragment of text.
  binarySearch(
    0,
    text.length,
    (l, r, m) => {
      const temp = text.slice(l, m);
      textContainer.innerText = currentText + temp;
      const height = getElementHeight(container);
      const isExceededMaximun = height > max;
      if (!isExceededMaximun) {
        currentText += temp;
      }
      return isExceededMaximun;
    },
    (l, r, m) => l === m
  );
  // Remove the exclude char at the end of the content.
  currentText = handleEndExcludes(currentText);
  textContainer.innerText = currentText;
  // Callback after reflow.
  handleOnReflow(true, currentText);
}

function truncateHTML(container: HTMLElement, textContainer: HTMLElement, max: number) {
  // only enter this function when container overflow.
  const children = textContainer.childNodes;
  if (children.length === 1) {
    const node = children[0] as HTMLElement;
    if (node.nodeType === Node.TEXT_NODE) {
      truncateText(container, textContainer, max);
    } else {
      const html = node.innerHTML;
      // clear content to determine whether the empty node can be placed.
      node.innerHTML = '';
      const height = getElementHeight(container);
      if (height > max) {
        // return after remove the node, if overflow with empty node.
        textContainer.removeChild(node);
        handleOnReflow(true, textContainer.innerHTML);
        return;
      }
      node.innerHTML = html;
      // recursive truncate node
      truncateHTML(container, node, max);
    }
  } else {
    const nodes = [].slice.call(children);
    const _nodes: Array<never> = [];
    // find the critical node
    let i = 0;
    binarySearch(
      0,
      nodes.length,
      (l, r, m) => {
        textContainer.innerHTML = '';
        const currentNodes = nodes.slice(l, m);
        _nodes.forEach((node) => {
          textContainer.appendChild(node);
        });
        currentNodes.forEach((node) => {
          textContainer.appendChild(node);
        });
        const height = getElementHeight(container);
        const isExceededMaximun = height > max;
        if (!isExceededMaximun) {
          currentNodes.forEach((node) => {
            _nodes.push(node);
          });
        }
        return isExceededMaximun;
      },
      (l, r, m) => {
        if (l === m) {
          const height = getElementHeight(container);
          const isExceededMaximun = height > max;
          i = m;
          if (!isExceededMaximun) {
            textContainer.appendChild(nodes[i]);
          }
          return true;
        }
        return false;
      }
    );
    if (textContainer.childNodes[i]) {
      // truncate the critical node
      truncateHTML(container, textContainer.childNodes[i] as HTMLElement, max);
    }
  }
}

function isTextInEndExcludes(text: string) {
  for (const item of props.endExcludes) {
    if (isRegExp(item)) {
      if (item.test(text)) {
        return true;
      }
    } else if (item === text) {
      return true;
    }
  }
  return false;
}

function handleEndExcludes(text: string) {
  while (!!text.length && isTextInEndExcludes(text[text.length - 1])) {
    text = text.slice(0, -1);
  }
  return text;
}

onMounted(() => {
  reflow();
  if (aref.value && props.reflowOnResize) {
    if (isSupportResizeObserver) {
      observer.value = new ResizeObserver(reflow);
      observer.value.observe(aref.value);
    } else {
      window.addEventListener('resize', reflow);
    }
  }
});
onUnmounted(() => {
  // Remove observer when component unmounted.
  if (isSupportResizeObserver && observer.value) {
    observer.value?.disconnect?.();
  } else {
    window.removeEventListener('resize', reflow);
  }
});
</script>

<template>
  <div ref="aref" class="vue-ellipsis-js">
    <span ref="textRef" class="vue-ellipsis-js-content"></span>
    <span ref="ellipsisRef" class="vue-ellipsis-js-ellipsis" @click="handleEllipsisClick">
      <slot name="ellipsisNode"></slot>
    </span>
    <span
      v-if="!ellipsis && $slots.unellipsisNode"
      ref="unellipsisRef"
      class="vue-ellipsis-js-unellipsis"
      @click="handleUnellipsisClick">
      <slot name="unellipsisNode"></slot>
    </span>
  </div>
</template>

<style scoped></style>
