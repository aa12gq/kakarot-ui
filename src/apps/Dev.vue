<template>
  <ul class="flex flex-col justify-center space-y-10 p-10 min-h-[100%] -intro-x bg-gradient-to-t box from-lime-500">
    <li class="text-center text-2xl">emmmm...., 这里还是一片未开发的处女地...</li>
    <li class="flex flex-col md:flex-row items-center justify-center space-x-4">
      <img alt="devimg1" :src="devimg1" class="border rounded-[0.4rem] z-[11] hover:sepia rotate-12 translate-x-20 cursor-pointer w-[20rem] shadow-[2px_2px_3px_0_rgb(0,0,0,0.5)]" />
      <img
        alt="devimg3"
        :src="devimg3"
        class="border rounded-[0.4rem] z-[12] hover:sepia cursor-pointer w-[26rem] shadow-[2px_2px_3px_0_rgb(0,0,0,0.5)] hover:shadow-[12px_12px_5px_0_rgb(0,0,0,0.5)]"
      />
      <img alt="devimg2" :src="devimg2" class="border rounded-[0.4rem] z-[11] hover:sepia -rotate-12 -translate-x-20 cursor-pointer w-[20rem] shadow-[2px_2px_3px_0_rgb(0,0,0,0.5)]" />
    </li>
    <li class="flex pt-5 justify-center text-2xl space-x-1">
      <span>研发人员们正在火速赶来.....</span>
      <svg width="15" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" :fill="darkMode ? '#ffff00' : '#ffffff'">
        <g transform="matrix(1 0 0 -1 0 80)">
          <rect width="10" height="20" rx="3">
            <animate attributeName="height" begin="0s" dur="4.3s" values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear" repeatCount="indefinite" />
          </rect>
          <rect x="15" width="10" height="80" rx="3">
            <animate attributeName="height" begin="0s" dur="2s" values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear" repeatCount="indefinite" />
          </rect>
          <rect x="30" width="10" height="50" rx="3">
            <animate attributeName="height" begin="0s" dur="1.4s" values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear" repeatCount="indefinite" />
          </rect>
          <rect x="45" width="10" height="30" rx="3">
            <animate attributeName="height" begin="0s" dur="2s" values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear" repeatCount="indefinite" />
          </rect>
        </g>
      </svg>
    </li>
    <li class="flex flex-col md:flex-row items-center justify-center space-x-4">
      <img alt="devimg4" :src="devimg4" class="border rounded-[0.4rem] z-[11] hover:sepia rotate-0 translate-x-20 cursor-pointer w-[26rem] shadow-[2px_2px_3px_0_rgb(0,0,0,0.5)]" />
      <img
        alt="devimg5"
        :src="devimg5"
        class="border rounded-[0.4rem] z-[10] hover:sepia cursor-pointer w-[21rem] shadow-[2px_2px_3px_0_rgb(0,0,0,0.5)] hover:shadow-[12px_12px_5px_0_rgb(0,0,0,0.5)]"
      />
    </li>
    <li class="flex justify-center">
      <Button
        @click="
          () => {
            router.back();
          }
        "
        variant="primary"
        class="border-none inline-block w-24 mb-2 mr-1 bg-primary/[0.1] hover:bg-primary/[0.3]"
      >
        先回去吧
      </Button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import Button from '@/base-components/Button';
import devimg1 from '@/assets/images/dev-i1.jpg';
import devimg2 from '@/assets/images/dev-i2.jpg';
import devimg3 from '@/assets/images/dev-i3.jpg';
import devimg4 from '@/assets/images/dev-i4.jpg';
import devimg5 from '@/assets/images/dev-i5.jpg';
import { darkMode } from '@/components/DarkModeSwitcher/scripts';
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped></style>
