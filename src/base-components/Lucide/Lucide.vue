<script setup lang="ts">
import * as icons from './icons';
import type { Icon } from './types';
import { SVGAttributes } from 'vue';
interface LucideProps extends /* @vue-ignore */ SVGAttributes {
  icon: Icon;
  title?: string;
}
const props = defineProps<LucideProps>();
</script>

<template>
  <component :is="icons[props.icon]" class="stroke-1.5" />
</template>
