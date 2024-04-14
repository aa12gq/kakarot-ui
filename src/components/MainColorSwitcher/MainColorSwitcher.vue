<script setup lang="ts">
import Tippy from "@/base-components/Tippy";
import ThemeColorIcon from "@/assets/images/theme-color.svg";
import {Menu} from "@/base-components/Headless";
import {setColorSchemeClass, switchColorScheme, colorScheme} from "./scripts";
import {themeName} from "@/stores/color-scheme";
setColorSchemeClass();
</script>
<template>
  <!-- BEGIN: Main Color Switcher -->
  <div class="z-50 flex relative">
    <Menu class="flex">
      <Tippy content="主题颜色" :options="{placement:'bottom'}"
             class="w-6 z-[60]" :src="ThemeColorIcon">
        <Menu.Button as="img" class="w-5" :src="ThemeColorIcon">点击进行主题颜色切换</Menu.Button>
      </Tippy>
      <Menu.Items  placement='bottom' class="w-10 pl-1">
        <Tippy :content="themeName('default')" :options="{placement:'right'}">
        <Menu.Item
            as="a"
            @click="switchColorScheme('default')"
           :class="['block w-8 h-8 cursor-pointer hover:bg-sky-900 dark:hover:bg-sky-900  dark:bg-sky-900 bg-sky-900 rounded-full border-4 mr-1 hover:border-slate-200',
                  {'border-slate-300 dark:border-darkmode-800/80': colorScheme === 'default'},
                  {'border-white dark:border-darkmode-600': colorScheme !== 'default' }]"/>
          </Tippy>
        <Tippy :content="themeName('theme-1')"  :options="{placement:'right'}">
         <Menu.Item
            as="a"
            @click="switchColorScheme('theme-1')"
           :class="['block w-8 h-8 cursor-pointer hover:bg-emerald-900 dark:bg-emerald-900 dark:hover:bg-emerald-900 bg-emerald-900 rounded-full border-4 mr-1 hover:border-slate-200',
                  {'border-slate-300 dark:border-darkmode-800/80': colorScheme === 'theme-1'},
                  {'border-white dark:border-darkmode-600': colorScheme !== 'theme-1' }]"/>
        </Tippy>
        <Tippy :content="themeName('theme-2')"  :options="{placement:'right'}">
        <Menu.Item
            as="a"
            @click="switchColorScheme('theme-2')"
           :class="['block w-8 h-8 cursor-pointer hover:bg-fuchsia-900 dark:bg-fuchsia-900 dark:hover:bg-fuchsia-900  bg-fuchsia-900 rounded-full border-4 mr-1 hover:border-slate-200',
                  {'border-slate-300 dark:border-darkmode-800/80': colorScheme === 'theme-2'},
                  {'border-white dark:border-darkmode-600': colorScheme !== 'theme-2' }]"/>
        </Tippy>
        <Tippy :content="themeName('theme-3')"  :options="{placement:'right'}">
        <Menu.Item
            as="a"
            @click="switchColorScheme('theme-3')"
           :class="['block w-8 h-8 cursor-pointer hover:bg-cyan-900 dark:bg-cyan-900 dark:hover:bg-cyan-900 bg-cyan-900 rounded-full border-4 mr-1 hover:border-slate-200',
                  {'border-slate-300 dark:border-darkmode-800/80': colorScheme === 'theme-3'},
                  {'border-white dark:border-darkmode-600': colorScheme !== 'theme-3' }]"/>
        </Tippy>
        <Tippy :content="themeName('theme-4')"  :options="{placement:'right'}">
       <Menu.Item
            as="a"
            @click="switchColorScheme('theme-4')"
           :class="['block w-8 h-8 cursor-pointer hover:bg-indigo-900 dark:bg-indigo-900 dark:hover:bg-indigo-900 bg-indigo-900 rounded-full border-4 mr-1 hover:border-slate-200',
                  {'border-slate-300 dark:border-darkmode-800/80': colorScheme === 'theme-4'},
                  {'border-white dark:border-darkmode-600': colorScheme !== 'theme-4' }]"/>
        </Tippy>
        <Tippy :content="themeName('theme-5')"  :options="{placement:'right'}">
        <Menu.Item
            as="a"
            @click="switchColorScheme('theme-5')"
            :class="['block w-8 h-8 cursor-pointer hover:bg-rose-900 dark:bg-rose-900 dark:hover:bg-rose-900 bg-rose-900 rounded-full border-4 mr-1 hover:border-slate-200',
                  {'border-slate-300 dark:border-darkmode-800/80': colorScheme === 'theme-5'},
                  {'border-white dark:border-darkmode-600': colorScheme !== 'theme-5' }]"/>
        </Tippy>
      </Menu.Items>
    </Menu>
  </div>
  <!-- END: Main Color Switcher -->
</template>
