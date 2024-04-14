<script setup lang="ts">
import {darkMode} from "@/components/DarkModeSwitcher/scripts";
import {setDarkModeClass, switchMode} from "@/components/DarkModeSwitcher/scripts";
setDarkModeClass();
</script>

<template>
  <!-- BEGIN: Dark Mode Switcher -->
  <div
      class="flex items-center justify-center ml-2"
      @click="switchMode"
  >
    <div
        :class="[
        'border w-[38px] h-[24px] p-px outline-none rounded-full relative cursor-pointer',
        'before:content-[\'\'] before:w-[22px] before:h-[22px] before:transition-all before:duration-200 before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:absolute before:inset-y-0 before:my-auto before:rounded-full',
        {
          'bg-primary border-primary': darkMode,
          'before:ml-[13px] before:bg-white': darkMode,
        },
      ]"
    ></div>
  </div>
  <!-- END: Dark Mode Switcher -->
</template>
