<script setup lang="ts">
import MainLayout from '@/layouts/main/Main.vue';
import { config } from '@/config';
import { authStore } from '@/stores/components/auth';
import { Dialog } from '@/base-components/Headless';
import Lucide from '@/base-components/Lucide';
import Button from '@/base-components/Button';
import { loadingIndicator } from '@/components/LoadingIndicator';
import { ref, watch } from 'vue';
import { RenewJWT } from '@/components/Auth';
import { initUserMenu, isPageGranted } from '@/stores/components/menu/side-menu';
import { AlertMessage, Alerts, SetAlertMessages } from '@/base-components/Alert';
import Page403 from '@/apps/_403.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
/*****************************************************
 * Home组件对用户登录状态进行验证, 状态正确后再加载页面框架  *
 *****************************************************/
// 只在初次加载时检查,用于防止从未登录时，过早加载页面
let loginInactive = true;
// 如果必须登录,则先不渲染主页面
const loginStatusCheckComplete = ref(config.allowNoAuth);
const loinCheckingPromptText = ref('账号环境检测中');
// 初次渲染,立即验证登录状态,此前可能登录过, 尽快检查token是否有效。
let re = RenewJWT();
if (re) {
  re.then(() => {}).finally(() => {
    // 从服务端校验完token后再确认登录状态.
    loginInactive = !config.allowNoAuth && (!authStore().Account || !authStore().Active);

    setTimeout(() => {
      loginStatusCheckComplete.value = true;
    }, 300);
  });
} else {
  loginInactive = !config.allowNoAuth && (!authStore().Account || !authStore().Active);
  setTimeout(() => {
    loginStatusCheckComplete.value = true;
  }, 300);
}

const alertWarnings = ref<AlertMessage[]>([]);
const userMenuInitialized = ref(false);

// 登录状态检查完毕后,开始初始化用户菜单配置
watch(loginStatusCheckComplete, () => {
  // 用户已登录则获取用户菜单
  if (!loginInactive) {
    loinCheckingPromptText.value = '用户菜单读取中';
    initUserMenu()
      .then(undefined, why => {
        SetAlertMessages(alertWarnings, [{ index: 0n, autoDismiss: 2000, message: why.message }]);
      })
      .finally(() => {
        // 延时切换状态
        setTimeout(() => {
          userMenuInitialized.value = true;
        }, 300);
      });
  } else {
    userMenuInitialized.value = true;
  }
});
</script>
<template>
  <Alerts :messages="alertWarnings" class="z-[999] fixed text-white bg-warning/50 border-none left-[36vw] top-[39vh] xl:w-[20vw]" />
  <!-- 用户已登录、页面菜单已完成初始化、未获得页面授权 -->
  <Page403 v-if="!loginInactive && userMenuInitialized && !isPageGranted()" />
  <template v-else-if="userMenuInitialized">
    <!--- 加载页面框架 --->
    <MainLayout v-if="!loginInactive" />
    <!-- BEGIN: 未登录提示-->
    <Dialog v-if="loginInactive && loginStatusCheckComplete" open>
      <Dialog.Panel>
        <div class="p-5 text-center">
          <button class="mt-3 focus-visible:outline-none">
            <Lucide icon="XCircle" class="w-16 h-16 mx-auto text-success" />
          </button>
          <div class="mt-5 text-3xl pl-3">您尚未登录！</div>
          <div class="mt-2 text-slate-500">
            请登录后使用本系统。
            <br />
          </div>
        </div>
        <div class="px-5 pb-8 flex items-center justify-center gap-x-3">
          <Button
            type="button"
            variant="primary"
            @click="
              () => {
                router.push({ name: 'login' });
              }
            "
            class="w-24"
          >
            前往登录
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: 未登录提示-->
  </template>
  <!-- BEGIN: 登录状态验证中提示-->
  <Dialog :open="!loginStatusCheckComplete || !userMenuInitialized">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <button class="mt-3 focus-visible:outline-none">
          <Lucide icon="Coffee" class="w-16 h-16 mx-auto text-success" />
        </button>
        <div class="mt-5 text-xl pl-3">{{ loinCheckingPromptText }}</div>
        <div class="mt-2 text-slate-500 flex items-center justify-center">
          <span>请稍后</span>
          <loadingIndicator.ThreeDot class="w-[1.6rem] ml-1 mt-1" />
        </div>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: 登录状态验证中提示-->
</template>
