<script setup lang="ts">
import { ref } from "vue";
import Lucide from "@/base-components/Lucide";
import logoUrl from "@/assets/images/logo.svg";
// import logo2Url from "@/assets/images/logo2.svg";
import avatar_default from "@/assets/images/avatar_default.png";
import iconApps from "@/assets/images/apps.svg";
import Breadcrumb from "@/base-components/Breadcrumb";
import { FormInput } from "@/base-components/Form";
import { Menu, Popover } from "@/base-components/Headless";
import _ from "lodash";
import { TransitionRoot } from "@headlessui/vue";
import fakeData from "@/stores/fake-data";

const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="top-bar-boxed h-[70px] z-[51] relative border-b border-white/[0.08] mt-12 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12"
  >
    <div class="flex items-center h-full">
      <!-- BEGIN: Logo -->
      <RouterLink :to="{ name: 'gvp-home' }" class="hidden -intro-x md:flex">
        <img
          alt="贝吉塔"
          class="w-6"
          src="https://bitpig-column.oss-cn-hangzhou.aliyuncs.com/AA12/190691488370262017.jpg"
        />
        <dl>
          <dt>
            <span class="ml-3 text-sm text-white"> 贝吉塔综合管理平台 </span>
          </dt>
          <dd class="ml-3 text-xs text-warning pr-1">
            <!-- <img
                alt="kakarot"
                class="w-12 float-right"
                :src="logo2Url"
            /> -->
          </dd>
        </dl>
      </RouterLink>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <Breadcrumb
        light
        class="h-full md:ml-10 md:pl-10 md:border-l border-white/[0.08] mr-auto -intro-x"
      >
        <Breadcrumb.Link to="/">
          <ul class="flex items-center">
            <li class="pr-1"><img alt="" class="w-4" :src="iconApps" /></li>
            <li>应用</li>
          </ul>
        </Breadcrumb.Link>
        <Breadcrumb.Link to="/" :active="true"> 全局看板 </Breadcrumb.Link>
        <Breadcrumb.Link to="/" :active="true"> 实时动态 </Breadcrumb.Link>
      </Breadcrumb>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Search -->
      <div class="relative mr-3 intro-x sm:mr-6">
        <div class="hidden search sm:block">
          <FormInput
            type="text"
            class="border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
            placeholder="搜索应用..."
            @focus="showSearchDropdown"
            @blur="hideSearchDropdown"
          />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
          />
        </div>
        <a class="relative text-white/70 sm:hidden" href="">
          <Lucide icon="Search" class="w-5 h-5 dark:text-slate-500" />
        </a>
        <TransitionRoot
          as="template"
          :show="searchDropdown"
          enter="transition-all ease-linear duration-150"
          enterFrom="mt-5 invisible opacity-0 translate-y-1"
          enterTo="mt-[3px] visible opacity-100 translate-y-0"
          entered="mt-[3px]"
          leave="transition-all ease-linear duration-150"
          leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
          leaveTo="mt-5 invisible opacity-0 translate-y-1"
        >
          <div class="absolute right-0 z-10 mt-[3px]">
            <div class="w-[450px] p-5 box"></div>
          </div>
        </TransitionRoot>
      </div>
      <!-- END: Search -->
      <!-- BEGIN: Notifications -->
      <Popover class="mr-4 intro-x sm:mr-6">
        <Popover.Button
          class="relative text-white/70 outline-none block before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger"
        >
          <Lucide icon="Bell" class="w-5 h-5 dark:text-slate-500" />
        </Popover.Button>
        <Popover.Panel class="w-[280px] sm:w-[350px] p-5 mt-2">
          <div class="mb-5 font-medium">通知</div>
        </Popover.Panel>
      </Popover>
      <!-- END: Notifications -->
      <!-- BEGIN: Account Menu -->
      <Menu>
        <Menu.Button
          class="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x"
        >
          <img alt="" :src="fakeData[0].users[0].avatar" />
        </Menu.Button>
        <Menu.Items
          class="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
        >
          <Menu.Header class="font-normal">
            <div class="font-medium">{{ fakeData[0].users[0].name }}</div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              {{ fakeData[0].users[0].job }}
            </div>
          </Menu.Header>
          <Menu.Devider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5">
            <Lucide icon="User" class="w-4 h-4 mr-2" /> 个人资料
          </Menu.Item>
          <Menu.Item class="hover:bg-white/5">
            <Lucide icon="Lock" class="w-4 h-4 mr-2" /> 修改密码
          </Menu.Item>
          <Menu.Devider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5">
            <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" /> 退出登录
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>
