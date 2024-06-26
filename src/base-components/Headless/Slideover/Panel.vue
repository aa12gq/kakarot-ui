<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {
  DialogPanel as HeadlessDialogPanel,
  TransitionChild,
} from "@headlessui/vue";
import _ from "lodash";
import {twMerge} from "tailwind-merge";
import type {ProvideSlideover} from "./Slideover.vue";
import {inject, useAttrs, computed} from "vue";

interface PanelProps extends /* @vue-ignore */ ExtractProps<typeof HeadlessDialogPanel> {
  as?: string | object;
  unmount?: boolean;
}

const {as, unmount} = withDefaults(defineProps<PanelProps>(), {
  as: "div",
  unmount: true,
});

const slideover = inject<ProvideSlideover>("slideover");

const attrs = useAttrs();
const computedClass = computed(() =>
    twMerge([
      "w-[90%] ml-auto h-screen flex flex-col bg-white relative shadow-md transition-transform dark:bg-darkmode-600",
      slideover?.size == "md" && "sm:w-[460px]",
      slideover?.size == "sm" && "sm:w-[300px]",
      slideover?.size == "lg" && "sm:w-[600px]",
      slideover?.size == "xl" && "sm:w-[600px] lg:w-[900px]",
      slideover?.size == "2xl" && "sm:w-[600px] lg:w-[1200px]",
      slideover?.size == "3xl" && "sm:w-[800px] lg:w-[1500px]",
      slideover?.zoom.value && "scale-105",
      typeof attrs.class === "string" && attrs.class,
    ])
);
</script>

<template>
  <TransitionChild
      v-if="slideover?.backdrop"
      as="div"
      enter="ease-in-out duration-[1200ms]"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in-out duration-[1000ms]"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      class="fixed inset-0 bg-black/60"
      aria-hidden="true"
      :unmount="unmount"
  />
  <TransitionChild
      :unmount="unmount"
      as="div"
      enter="ease-in-out duration-[1200ms]"
      enterFrom="opacity-0 -mr-[100%]"
      enterTo="opacity-100 mr-0"
      leave="ease-in-out duration-[1000ms]"
      leaveFrom="opacity-100 mr-0"
      leaveTo="opacity-0 -mr-[100%]"
      class="fixed inset-y-0 right-0"
  >
    <HeadlessDialogPanel as="template">
      <component
          :is="as"
          :class="computedClass"
          v-bind="_.omit(attrs, 'class')"
      >
        <slot></slot>
      </component>
    </HeadlessDialogPanel>
  </TransitionChild>
</template>
