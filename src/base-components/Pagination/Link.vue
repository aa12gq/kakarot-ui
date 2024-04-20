<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';
import { withDefaults, computed, ref, watch, type LiHTMLAttributes, useAttrs } from 'vue';
import Button from '../Button';

export interface LinkProps extends /* @vue-ignore */ LiHTMLAttributes {
  as?: string | object;
  active?: boolean;
}
interface LinkEmit {
  (e: 'update:active', value: boolean): void;
}

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'a',
  active: false,
});

const attrs = useAttrs();

const computedClass = computed(() =>
  twMerge([
    'min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3',
    props.active && '!box font-medium dark:bg-darkmode-400',
    typeof attrs.class === 'string' && attrs.class,
  ])
);
const localValue = ref(props.active);
const emit = defineEmits<LinkEmit>();

watch(props, () => {
  emit('update:active', props.active);
});

watch(
  props,
  () => {
    localValue.value = props.active;
  },
  { deep: true }
);
</script>

<template>
  <li class="flex-1 sm:flex-initial">
    <Button :as="as" :class="computedClass" v-bind="_.omit(attrs, 'class')" v-model="localValue">
      <slot></slot>
    </Button>
  </li>
</template>
