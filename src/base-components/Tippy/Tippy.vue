<script setup lang="ts">
import tippy, { roundArrow, animateFill as animateFillPlugin, type Content, type Placement } from 'tippy.js';
import type { Props, PopperElement } from 'tippy.js';
import 'tippy.js/themes/translucent.css';
import { withDefaults, ref, onMounted, inject, watch } from 'vue';

export type ProvideTippy = (el: PopperElement) => void;

interface TippyProps {
  refKey?: string;
  content: Content;
  as?: string | object;
  placement?: Placement;
  options?: Partial<Props>;
}

const props = withDefaults(defineProps<TippyProps>(), {
  as: 'span',
});

const tippyRef = ref<PopperElement>();
const init = (el: PopperElement, props: TippyProps) => {
  return tippy(el, {
    plugins: [animateFillPlugin],
    content: props.content,
    placement: props.placement,
    arrow: roundArrow,
    popperOptions: {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: 'viewport',
          },
        },
      ],
    },
    theme: 'translucent',
    animateFill: false,
    animation: 'shift-away',
    ...props.options,
  });
};

const bindInstance = (el: PopperElement) => {
  if (props.refKey) {
    const bind = inject<ProvideTippy>(`bind[${props.refKey}]`, () => {});
    if (bind) {
      bind(el);
    }
  }
};

const vTippyDirective = {
  mounted(el: PopperElement) {
    tippyRef.value = el;
  },
};
onMounted(() => {
  if (tippyRef.value) {
    const tp = init(tippyRef.value, props);
    bindInstance(tippyRef.value);
    watch(
      props,
      () => {
        tp.setContent(props.content);
      },
      { deep: true }
    );
  }
});
</script>
<style scoped>
.tippy-box {
  font-size: 0.8rem !important;
}
</style>
<template>
  <component :is="as" v-tippy-directive class="cursor-pointer">
    <slot></slot>
  </component>
</template>
