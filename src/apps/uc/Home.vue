<script setup lang="ts">
import Lucide from '@/base-components/Lucide';
import { findMenu } from '@/stores/components/menu/side-menu';
import { userAvatar } from '@/stores/apps/uc';
import { ucStore } from '@/stores/apps/uc';
import { useRoute } from 'vue-router';

const route = useRoute();

const cm = findMenu('uc');
const menus = cm?.subMenu;
</script>
<template>
  <h2 class="mt-2 text-lg font-medium">个人中心</h2>
  <div class="grid grid-cols-12 gap-3 mt-4 box bg-slate-50 dark:bg-darkmode-400 p-3">
    <!-- BEGIN: 左边菜单-->
    <div class="flex flex-col-reverse col-span-12 lg:col-span-2 2xl:col-span-2 lg:block">
      <div class="h-full mt-5 box lg:mt-0">
        <div class="relative flex items-center p-5">
          <div class="w-12 h-12 image-fit cursor-pointer">
            <img alt="头像" class="rounded-full" :src="userAvatar" />
          </div>
          <div class="ml-4 mr-auto">
            <div class="text-base font-medium">
              <RouterLink :to="{ name: 'uc' }">{{ ucStore().BasicInfo?.fullName }}</RouterLink>
            </div>
          </div>
        </div>
        <div v-if="menus" class="border-t overflow-hidden border-slate-200/60 px-1 py-2 dark:border-darkmode-400">
          <RouterLink
            v-for="(menu, key) in menus"
            :to="{ name: menu.pageName }"
            :key="`uc-menu-${key}`"
            :class="['flex items-center px-3 py-2 rounded hover:bg-black/5', { 'font-medium text-primary': route.name === menu.pageName }]"
          >
            <Lucide :icon="menu.icon" class="w-4 h-4 mr-2" />
            {{ menu.title }}
          </RouterLink>
        </div>
      </div>
    </div>
    <!-- END: 左边菜单-->
    <!-- BEGIN: 右边子页面 -->
    <div class="box overflow-hidden col-span-12 lg:col-span-10 2xl:col-span-10">
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </RouterView>
    </div>
  </div>
  <!-- END: 右边子页面 -->
</template>

>
