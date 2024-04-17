<script setup lang="ts">
import errorIllustration from '../assets/images/error-illustration.svg';
import Button from '../base-components/Button';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="py-2">
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div class="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
        <div class="-intro-x lg:mr-20">
          <img alt="Midone Tailwind HTML Admin Template" class="w-[450px] h-48 lg:h-auto" :src="errorIllustration" />
        </div>
        <div class="mt-10 text-white lg:mt-0">
          <div class="font-medium intro-x text-8xl">404</div>
          <div class="mt-5 text-xl font-medium intro-x lg:text-3xl">Emmmm....页面不存在!</div>
          <div class="mt-3 text-lg intro-x">您输入的地址错误，或对应的页面已经不存在。</div>
          <Button
            @click="
              () => {
                router.push('/');
              }
            "
            class="px-4 py-3 mt-10 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200"
          >
            访问首页
          </Button>
          <Button
            @click="
              () => {
                router.back();
              }
            "
            class="px-4 py-3 mt-10 ml-3 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200"
          >
            返回上一页
          </Button>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>
