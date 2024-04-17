<script setup lang="ts">
import Tab from '@/base-components/Headless/Tab';
import Lucide from '@/base-components/Lucide';
import BasicInfo from './BasicInfo.vue';
import { computed } from 'vue';
import { darkMode } from '@/components/DarkModeSwitcher';

const tabButtonClass = computed(() => (selected: boolean) => {
  return [
    'flex items-center justify-center w-full px-0 py-2 sm:w-40 text-slate-500',
    {
      'hover:border-transparent hover:bg-slate-100 hover:text-slate-600 hover:dark:bg-darkmode-700 hover:dark:text-slate-300': !selected,
    },
    {
      'text-primary border-transparent dark:bg-darkmode-600 dark:border-x-transparent dark:border-t-transparent dark:text-white': selected,
    },
  ];
});
</script>
<template>
  <Tab.Group class="-intro-y box overflow-hidden col-span-12 h-full lg:col-span-9 2xl:col-span-10">
    <Tab.List variant="tabs" class="border-b-0 flex-col overflow-x-auto overflow-y-hidden scrollbar-slim border-transparent dark:border-transparent sm:flex-row bg-slate-200 dark:bg-darkmode-800">
      <Tab v-slot="{ selected }">
        <Tab.Button :class="tabButtonClass(selected)" as="button">
          <Lucide :icon="darkMode ? 'BasicInfoDark' : 'BasicInfo'" class="w-4 h-4 mr-2" />
          基本信息
        </Tab.Button>
      </Tab>
    </Tab.List>
    <Tab.Panels class="h-full">
      <Tab.Panel :unmount="false" class="p-1 border rounded m-2 bg-slate-100/70 dark:bg-slate-800/70 leading-relaxed">
        <BasicInfo />
      </Tab.Panel>
      <Tab.Panel :unmount="false" class="p-1 border rounded m-2 bg-slate-100/70 dark:bg-slate-800/70 leading-relaxed"></Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
</template>
