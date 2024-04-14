<script setup lang="ts">
import Notification from "@/base-components/Notification"
import Lucide from "@/base-components/Lucide";
import type {NotificationElement} from "@/base-components/Notification";
import { provide, ref, watch } from "vue";

const errorNotify = ref<NotificationElement>();

provide("bind[errorNotify]", (el: NotificationElement) => {
  errorNotify.value = el;
});
interface Props {
  msg: string
}

const props = defineProps<Props>();
watch(props, (m) => {
  errorNotify.value?.showToast();
})
</script>
<template>
  <Notification refKey="errorNotify" :options="{
                    close: true,
                    offset: {y: '3rem', x: '3rem'},
                  }"
                class="items-center text-xs py-2 flex gap-x-2 px-5 bg-white/[0.95]">
    <Lucide icon="AlertTriangle" class="w-7 text-warning"/>
    <span class="inline-block align-middle">{{ props.msg }}</span>
  </Notification>
</template>