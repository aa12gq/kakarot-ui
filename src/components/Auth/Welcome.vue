<script lang="ts">
import {ref, provide} from "vue";
export default {
}
import type {NotificationElement} from "@/base-components/Notification";
const notificationWelcome = ref<NotificationElement>();
export const showWelcome = ()=>{
  notificationWelcome.value?.showToast();
  }
</script>
<script setup lang="ts">
import Notification from "@/base-components/Notification"
import {ucStore} from "@/stores/apps/uc";
import {userAvatar} from "@/stores/apps/uc";
provide("bind[notificationWelcome]", (el: NotificationElement) => {
  notificationWelcome.value = el;
});
const uc = ucStore();
</script>
<template>
  <!-- BEGIN: 欢迎通知 -->
  <Notification v-if="uc.BasicInfo" refKey="notificationWelcome" :options="{
                    close: true,
                    offset: {y: 50, x: 0},
                    duration: 2000
                  }" class="flex py-5 pl-5">
    <div class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
      <img :alt="`${uc.BasicInfo.name}的头像`" :src="userAvatar" />
    </div>
    <div class="ml-4 sm:mr-28">
      <div class="font-medium">
        {{ uc.BasicInfo?.name}}
      </div>
      <div class="font-medium">
       
      </div>
      <div class="mt-1 text-slate-500">
    欢迎使用贝吉塔管理平台！<br>
    这是您管理事务、提高效率的理想工具，<br>
    让您轻松应对各种任务和挑战。<br>
    祝您使用愉快，事业蒸蒸日上！🌟🌟🌟
</div>
    </div>
    <a data-dismiss="notification" class="absolute top-0 bottom-0 right-0 flex items-center px-6 font-medium border-l border-slate-200/60 dark:border-darkmode-400 text-primary dark:text-slate-400" href="#">
    </a>
  </Notification>
  <!-- END: 欢迎通知 -->
</template>