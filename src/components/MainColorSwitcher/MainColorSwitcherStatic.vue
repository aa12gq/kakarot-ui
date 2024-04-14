<script setup lang="ts">
import {setColorSchemeClass, switchColorScheme, colorScheme} from "./scripts";
import {themeName} from "@/stores/color-scheme";
import Tippy from "@/base-components/Tippy";
setColorSchemeClass();
</script>

<template>
  <!-- BEGIN: Main Color Switcher -->
  <div
    class="flex items-center justify-center px-2 border rounded box"
  >
    <Tippy :content="themeName('default')">
    <a
      @click="switchColorScheme('default')"
      :class="[
        'block w-5 h-5 cursor-pointer bg-sky-900 border-1 rounded-[2px] mr-[1px] hover:border-slate-200',
        {
          'border-slate-300 border-2 p-[0.6rem] dark:border-darkmode-800/80':
            colorScheme === 'default',
        },
        { 'border-white dark:border-darkmode-600': colorScheme !== 'default' },
      ]"
    ></a>
    </Tippy>
    <Tippy :content="themeName('theme-1')">
    <a
      @click="switchColorScheme('theme-1')"
      :class="[
        'block w-5 h-5 cursor-pointer bg-emerald-900 border-1 rounded-[2px] mr-[1px] hover:border-slate-200',
        {
          'border-slate-300 border-2 p-[0.6rem] dark:border-darkmode-800/80':
            colorScheme === 'theme-1',
        },
        { 'border-white dark:border-darkmode-600': colorScheme !== 'theme-1' },
      ]"
    ></a>
    </Tippy>
    <Tippy :content="themeName('theme-2')">
    <a
      @click="switchColorScheme('theme-2')"
      :class="[
        'block w-5 h-5 cursor-pointer bg-fuchsia-800 border-1 rounded-[2px] mr-[1px] hover:border-slate-200',
        {
          'border-slate-300 border-2 p-[0.6rem] dark:border-darkmode-800/80':
            colorScheme === 'theme-2',
        },
        { 'border-white dark:border-darkmode-600': colorScheme !== 'theme-2' },
      ]"
    ></a>
    </Tippy>
    <Tippy :content="themeName('theme-3')">
    <a
      @click="switchColorScheme('theme-3')"
      :class="[
        'block w-5 h-5 cursor-pointer bg-cyan-900 border-1 rounded-[2px] mr-[1px] hover:border-slate-200',
        {
          'border-slate-300 border-2 p-[0.6rem] dark:border-darkmode-800/80':
            colorScheme === 'theme-3',
        },
        { 'border-white dark:border-darkmode-600': colorScheme !== 'theme-3' },
      ]"
    ></a>
    </Tippy>
    <Tippy :content="themeName('theme-4')">
    <a
      @click="switchColorScheme('theme-4')"
      :class="[
        'block w-5 h-5 cursor-pointer bg-indigo-900 border-1 rounded-[2px] mr-[1px] hover:border-slate-200',
        {
          'border-slate-300 border-2 p-[0.6rem] dark:border-darkmode-800/80':
            colorScheme === 'theme-4',
        },
        { 'border-white dark:border-darkmode-600': colorScheme !== 'theme-4' },
      ]"
    ></a>
    </Tippy>
    <Tippy :content="themeName('theme-5')">
      <a
          @click="switchColorScheme('theme-5')"
          :class="[
        'block w-5 h-5 cursor-pointer bg-rose-900 border-1 rounded-[2px] hover:border-slate-200',
        {
          'border-slate-300 border-2 p-[0.6rem] dark:border-darkmode-800/80':
            colorScheme === 'theme-5',
        },
        { 'border-white dark:border-darkmode-600': colorScheme !== 'theme-5' },
      ]"
      ></a>
    </Tippy>
  </div>
  <!-- END: Main Color Switcher -->
</template>
