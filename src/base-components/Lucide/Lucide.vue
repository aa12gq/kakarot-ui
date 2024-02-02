<script setup lang="ts">
import * as icons from "./icons"
import type { SVGAttributes } from "vue";
export type Icon = keyof typeof icons;
interface LucideProps extends SVGAttributes {
  icon: Icon;
  title?: string;
}
const props = defineProps<LucideProps>();
</script>

<template>
  <component :is="icons[props.icon]" class="stroke-1.5" />
</template>
