<script setup lang="ts">
import MobileMenu from "@/components/MobileMenu";
import TopBar from "@/components/TopBar";
import {SideMenu} from "@/components/SideMenu";
import DevView from "@/apps/Dev.vue";
import {config} from '@/config'
import {Logout, RenewJWT} from "@/components/Auth";
import {authStore} from "@/stores/components/auth";
import {Dialog} from "@/base-components/Headless";
import Lucide from "@/base-components/Lucide";
import Button from "@/base-components/Button";
import {computed, onBeforeUpdate, onMounted, onUpdated, provide, ref} from "vue";
import {ucStore} from "@/stores/apps/uc";
import LoginStatusNotification, {showLoginStatus} from "@/components/Auth/LoginStatusNotification.vue"
import { useRouter } from "vue-router";

const router = useRouter();
const requireAuthModalOpen = computed((): boolean => {
  return !config.allowNoAuth && (!authStore().Account || !authStore().Active) && !logoutModalOpen.value;
});

const layoutMounted = ref(false);
onMounted(() => {
  layoutMounted.value = true;
});

onBeforeUpdate(() => {
  layoutMounted.value = false;
});
onUpdated(() => {
  layoutMounted.value = true;
})
provide("layoutMounted", layoutMounted);

/***BEGIN: 退出登录****/
const logoutModalOpen = ref(false);
const logoutRedirectCountDown = ref(3);
const logout = () => {
  Logout().then((): void => {
      logoutModalOpen.value = true;
      let cd = setInterval(() => {
        if (logoutRedirectCountDown.value === 0) {
          clearInterval(cd);
          setTimeout(() => router.push({name: "login"}), 1000);
          return;
        }
        logoutRedirectCountDown.value--
      }, 1000)
    },
    (why) => {
      throw why;
    }
  );
}
provide("logout", logout);

const reloadAuth = () => {
  authStore().$hydrate();
  authStore().reloadActive();
  ucStore().$hydrate();
  showLoginStatus();
}
/***END: 退出登录***/
</script>
<style scoped>
#layoutWrapper {
  padding-top: theme("spacing.2");
  padding-left: theme("spacing.2");
  padding-right: theme("spacing.2");
@media screen(sm) {
  padding-left: theme("spacing.3");
  padding-right: theme("spacing.3");
}
}
</style>
<template>
  <!-- 登录状态通知  -->
  <LoginStatusNotification/>
  <!-- BEGIN: 要求登录提示. 用户可能登录后token失效-->
  <Dialog :open="requireAuthModalOpen">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <button class="mt-3 focus-visible:outline-none">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto text-success"/>
        </button>
        <div class="mt-5 text-2xl pl-3">您尚未登录或登录信息已过期！</div>
        <div class="mt-2 text-slate-500">
          请登录后使用本系统。若您已在其他窗口登录，请尝试点击下面的<span class="font-bold">"刷新登录状态"</span>可继续使用.
          <br/>
          <span class="text-warning">注意: 不要使用浏览器的刷新按钮或快捷键，否则刷新后会丢失当前页面状态。</span>
        </div>
      </div>
      <div class="px-5 pb-8 flex items-center justify-center gap-x-3">
        <Button type="button" variant="primary" @click="
                       ()=>{$router.push({name: 'login'})}
                      " class="w-24">
          前往登录
        </Button>
        <Button type="button" variant="pending" @click="reloadAuth">
          刷新登录状态
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: 要求登录提示-->

  <!-- TopBar toggleLayoutScroll方法中控制topBarWrapper, mainWrapper, sideMenu, pageWrapper的布局相关的class-->
  <div id="layoutWrapper"
       class="relative pb-3 before:content-[''] before:absolute before:inset-0 before:bg-fixed before:bg-no-repeat before:bg-skew-pattern dark:before:bg-skew-pattern-dark"
  >
    <!-- BEGIN: 退出登录提示-->
    <Dialog :open="logoutModalOpen">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <button class="mt-3 focus-visible:outline-none">
            <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto text-success"/>
          </button>
          <div class="mt-5 text-3xl pl-3">您已安全退出登录！</div>
          <div class="mt-2 text-slate-500">
            如需再次使用本系统，您需要重新进行登录。<br/>
            即将前往登录页面...
          </div>
          <div class="text-3xl text-slate-400">
            {{ logoutRedirectCountDown }}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: 退出登录提示-->
    <MobileMenu/>

    <!----以下开始页面主要框架渲染 ---->
    <div id="topBarWrapper" class="border-0 w-full pt-2">
      <TopBar/>
    </div>
    <div id="mainWrapper"
         :class="[
        'relative scrollbar-hidden mt-[0.68rem]',
        'before:content-[\'\'] before:w-[98%] before:z-[-1] before:rounded-[1rem] before:bg-white/10 before:h-full before:-mt-2 before:absolute before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/50',
        // Animation
        'before:translate-y-[35px] before:opacity-0 before:animate-[0.4s_ease-in-out_0.1s_intro-wrapper] before:animate-fill-mode-forwards',
      ]"
    >
      <div
        :class="[
          'translate-y-0 bg-primary flex rounded-[0.6rem] -mt-[7px] md:mt-0 dark:bg-darkmode-400',
          'before:block before:absolute before:inset-0 before:bg-black/[0.15] before:rounded-[0.6rem] before:z-[-1]',

          // Animation
          'animate-[0.4s_ease-in-out_0.2s_intro-wrapper] animate-fill-mode-forwards translate-y-[35px]',
        ]"
      >
        <!-- BEGIN: Side Menu -->
        <SideMenu id="sideMenu" keepMenuState class="overflow-y-scroll scrollbar-hidden"/>
        <!-- END: Side Menu -->
        <!-- BEGIN: Content -->
        <div id="pageWrapper"
             class="overflow-y-auto scrollbar-hidden border-t-[1.2rem] rounded-[0.6rem] border-black/[0.001] dark:border-black/[0.001] px-2 md:px-4 max-w-full md:max-w-auto rounded-[0.6rem] flex-1 min-w-0 pb-10 shadow-sm bg-slate-100 dark:bg-darkmode-700 before:content-[''] before:w-full before:h-px before:block"
        >
          <RouterView v-slot="{Component}">
            <KeepAlive>
              <Component :is="Component" v-if="$route.meta.keepAlive && !$route.meta.devPage"
                         :key="$route.path"></Component>
            </KeepAlive>
            <KeepAlive>
              <DevView :is="DevView" v-if="$route.meta.keepAlive && $route.meta.devPage" :key="$route.path"></DevView>
            </KeepAlive>
            <Component :is="Component" v-if="!$route.meta.keepAlive && !$route.meta.devPage"
                       :key="$route.path"></Component>
            <DevView v-if="!$route.meta.keepAlive && $route.meta.devPage" :key="$route.path"></DevView>
          </RouterView>
        </div>
        <!-- END: Content -->
      </div>
    </div>
  </div>
</template>