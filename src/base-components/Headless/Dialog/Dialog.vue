<script lang="ts">
export default {
  inheritAttrs: false,
};

type Size = "sm" | "md" | "lg" | "xl" | "4xl";
</script>

<script setup lang="ts">
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import { Dialog as HeadlessDialog, TransitionRoot } from "@headlessui/vue";
import { provide, useAttrs, computed, ref, type Ref } from "vue";

export type ProvideDialog = {
  open: boolean;
  zoom: Ref<boolean>;
  size?: Size;
};

interface DialogProps extends ExtractProps<typeof HeadlessDialog> {
  size?: Size;
  open: boolean;
  staticBackdrop?: boolean;
  unmount?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {
  as: "div",
  open: false,
  size: "md",
  unmount: true,
});

const { as, onClose, staticBackdrop, size } = props;
const open = computed(() => props.open);

const attrs = useAttrs();
const computedClass = computed(() =>
  twMerge(["relative z-[60]", typeof attrs.class === "string" && attrs.class])
);

const zoom = ref(false);
const emit = defineEmits<{
  (e: "close", value: boolean): void;
}>();

const handleClose = (value: boolean) => {
  if (!staticBackdrop) {
    onClose && onClose(value);
    emit("close", value);
  } else {
    zoom.value = true;
    setTimeout(() => {
      zoom.value = false;
    }, 300);
  }
};
provide<ProvideDialog>("dialog", {
  open: open.value,
  zoom: zoom,
  size: size,
});
</script>

<template>
  <TransitionRoot appear as="template" :show="open" :unmount="unmount">
    <HeadlessDialog
      :as="as"
      @close="
        (value) => {
          handleClose(value);
        }
      "
      :class="computedClass"
      v-bind="_.omit(attrs, 'class', 'onClose')"
      :unmount="unmount"
      :useInert="false"
    >
      <slot></slot>
    </HeadlessDialog>
  </TransitionRoot>
</template>
