<script lang="ts">
export default {}
import type {NotificationElement} from "@/base-components/Notification";
import { ref,provide } from "vue";

const loginStatus = ref<NotificationElement>();
export const showLoginStatus = () => {
  loginStatus.value?.showToast();
}
</script>
<script setup lang="ts">
import Notification from "@/base-components/Notification"
import {authStore} from "@/stores/components/auth";

provide("bind[loginStatus]", (el: NotificationElement) => {
  loginStatus.value = el;
});
</script>
<template>
  <!-- BEGIN: 登录状态通知 -->
  <Notification refKey="loginStatus" :options="{
                    close: false,
                    offset: {y: '43vh', x: 0},
                    duration: 2000
                  }"
                class="text-center border-none bg-transparent pr-0 py-0 pl-0 shadow-none">
    <div v-if="authStore().Active" class="bg-lime-400/70 text-white/90 pr-5  py-3 pl-3 text-xs rounded-[0.5rem] text-center flex justify-center items-center">
      您已登录！
    </div>
    <div v-else class="bg-cyan-900/70 text-white/80 pr-5  py-3 pl-3 text-xs rounded-[0.5rem] text-center flex justify-center items-center">
      <div>您未登录！</div>
    </div>
  </Notification>
  <!-- END: 登录状态通知 -->
</template>