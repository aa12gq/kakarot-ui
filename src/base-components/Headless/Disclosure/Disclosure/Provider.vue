<script setup lang="ts">
import { provide, computed } from 'vue';
import type { ComputedRef } from 'vue';

export type ProvideDisclosure = ComputedRef<{
  open: boolean;
  close: (ref?: HTMLElement | undefined) => void;
  index: number;
}>;

export interface ProviderProps {
  open: boolean;
  close: (ref?: HTMLElement) => void;
  index: number;
}

const props = withDefaults(defineProps<ProviderProps>(), {
  open: false,
  close: () => {},
  index: 0,
});

provide<ProvideDisclosure>(
  'disclosure',
  computed(() => {
    return {
      open: props.open,
      close: props.close,
      index: props.index,
    };
  })
);
</script>

<template>
  <slot></slot>
</template>
