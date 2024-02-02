<script setup lang="ts">
import { TabGroup as HeadlessTabGroup } from "@headlessui/vue";
import type {ExtractPropTypes} from "vue";
interface GroupProps extends ExtractPropTypes<typeof HeadlessTabGroup> {}

defineProps<GroupProps>();
</script>

<template>
  <HeadlessTabGroup as="div">
    <slot></slot>
  </HeadlessTabGroup>
</template>
