<script setup lang="ts">
import { useRoute } from 'vue-router';
import TopBar from '@/components/TopBar';
import DarkModeSwitcher from '@/components/DarkModeSwitcher';
import MainColorSwitcher from '@/components/MainColorSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { SideMenu } from '@/components/SideMenu';
const route = useRoute();
</script>

<template>
  <div class="pt-2 pb-7 before:content-[''] before:absolute before:inset-0 before:bg-fixed before:bg-no-repeat before:bg-skew-pattern dark:before:bg-skew-pattern-dark">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <MobileMenu />
    <TopBar />
    <div
      :class="[
        'relative',
        'before:content-[\'\'] before:w-[95%] before:z-[-1] before:rounded-[1.3rem] before:bg-white/10 before:h-full before:-mt-4 before:absolute before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/50',

        // Animation
        'before:translate-y-[35px] before:opacity-0 before:animate-[0.4s_ease-in-out_0.1s_intro-wrapper] before:animate-fill-mode-forwards',
      ]"
    >
      <div
        :class="[
          'translate-y-0 bg-primary flex rounded-[1.3rem] -mt-[7px] md:mt-0 dark:bg-darkmode-400',
          'before:block before:absolute before:inset-0 before:bg-black/[0.15] before:rounded-[1.3rem] before:z-[-1]',

          // Animation
          'animate-[0.4s_ease-in-out_0.2s_intro-wrapper] animate-fill-mode-forwards translate-y-[35px]',
        ]"
      >
        <!-- BEGIN: Side Menu -->
        <SideMenu keepMenuState />
        <!-- END: Side Menu -->
        <!-- BEGIN: Content -->
        <div
          class="px-4 md:px-[22px] max-w-full md:max-w-auto rounded-[1.3rem] flex-1 min-w-0 min-h-screen pb-10 shadow-sm bg-slate-100 dark:bg-darkmode-700 before:content-[''] before:w-full before:h-px before:block"
        >
          <RouterView v-slot="{ Component }">
            <KeepAlive>
              <Component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path"></Component>
            </KeepAlive>
            <Component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.path"></Component>
          </RouterView>
        </div>
        <!-- END: Content -->
      </div>
    </div>
  </div>
</template>
