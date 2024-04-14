<script setup lang="ts">
import { computed } from 'vue';
import Tippy, { type ProvideTippy } from '@/base-components/Tippy';
import Lucide from '@/base-components/Lucide/Lucide.vue';
import { darkMode, setDarkModeClass, switchMode } from '@/components/DarkModeSwitcher/scripts';

const modeIcon = computed(() => {
  return darkMode.value ? 'Sun1' : 'Moon1';
});
const iconTitle = computed(() => {
  return darkMode.value ? '白昼模式' : '暗夜模式';
});
setDarkModeClass();
</script>

<template>
  <!-- BEGIN: Dark Mode Switcher -->
  <Tippy :content="iconTitle" as="div" placement="bottom" class="z-50 flex items-center justify-center p-2 cursor-pointer hover:rounded-full hover:bg-slate-500/20" @click="switchMode">
    <Lucide class="w-5 h-5" :icon="modeIcon" />
  </Tippy>
  <!-- END: Dark Mode Switcher -->
</template>
