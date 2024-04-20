<script setup lang="ts">
import { TabPanel as HeadlessTabPanel, TransitionRoot } from "@headlessui/vue";
import type {ExtractPropTypes} from "vue";
import {onMounted, ref} from "vue";

interface PanelProps extends /* @vue-ignore */ ExtractPropTypes<typeof HeadlessTabPanel> {}

defineProps<PanelProps>();
const panel = ref(HeadlessTabPanel);
</script>

<template>
  <HeadlessTabPanel ref="panel"  as="template" v-slot="{ selected }">
    <TransitionRoot
      appear
      :unmount="panel.unmount||false"
      as="div"
      :show="selected"
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <slot :selected="selected"></slot>
    </TransitionRoot>
  </HeadlessTabPanel>
</template>
