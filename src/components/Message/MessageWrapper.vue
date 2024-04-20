<script setup lang="ts">
import { Alert } from '@/base-components/Alert';
import { Variant } from '@/base-components/Alert/Types';
import Lucide, { type Icon } from '@/base-components/Lucide';
import { ref } from 'vue';

interface Option {
  msg: string;
  type: Variant;
  icon?: Icon;
  autoDismiss?: number;
}

const messages = ref<Option[]>([]);

const add = (msg: Option) => {
  messages.value.push(msg);
};

defineExpose({
  Add: add,
});
</script>

<template>
  <div class="fixed top-[6vh] left-[25vw] flex gap-2 flex-col z-[999999]">
    <Alert v-for="(item, index) in messages" :variant="item.type" v-slot="{ dismiss }" :autoDismiss="item.autoDismiss ? item.autoDismiss : 1500" :key="index" class="z-[999999] w-[50vw]">
      <div class="flex items-center">
        <Lucide v-if="item.icon" :icon="item.icon" :class="'w-6 h-6 mr-2'" />
        <div>{{ decodeURIComponent(item.msg) }}</div>
      </div>
      <Alert.DismissButton type="button" :class="'btn-close text-white'" aria-label="关闭" @click="dismiss">
        <Lucide icon="X" class="w-4 h-4" />
      </Alert.DismissButton>
    </Alert>
  </div>
</template>

<style scoped></style>
