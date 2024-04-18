<script lang="ts">
export default {
  inheritAttrs: false,
};
import { getHeightWithMargin, getOutlineHeight } from '@/utils/dom-dimension';
import { layoutScrollLockStore } from '@/stores/components/top-bar';
import { useRoute, useRouter } from 'vue-router';

/**
 * 切换布局滚动锁定状态及自适应窗口大小
 * @param lock
 * @param noToggle
 */
export const toggleLayoutScroll = (lock?: boolean, noToggle?: boolean) => {
  let appWrapper = document.getElementById('app') as HTMLElement;
  let layoutWrapper = document.getElementById('layoutWrapper') as HTMLElement;
  let topBarWrapper = document.getElementById('topBarWrapper') as HTMLElement;
  let pageWrapper = document.getElementById('pageWrapper');
  let sideMenu = document.getElementById('sideMenu');
  let mainWrapper = document.getElementById('mainWrapper') as HTMLElement;
  if (!mainWrapper) {
    return;
  }
  if (lock === true) {
    layoutScrollLockStore().lock();
  } else if (lock === false) {
    layoutScrollLockStore().unlock();
  } else if (!noToggle && !layoutScrollLockStore().locked) {
    layoutScrollLockStore().lock();
  } else if (!noToggle) {
    layoutScrollLockStore().unlock();
  }
  if (layoutScrollLockStore().locked) {
    let totalHeight = window.innerHeight;
    let wrapperOutlineHeight = getOutlineHeight(document.body.parentElement!, document.body, appWrapper, layoutWrapper, mainWrapper);
    let cHeight = totalHeight - wrapperOutlineHeight - getHeightWithMargin(topBarWrapper);
    pageWrapper!.style.height = `${cHeight}px`;
    sideMenu!.style.height = `${cHeight}px`;
  } else {
    if (pageWrapper) pageWrapper.style.height = '';
    if (sideMenu) sideMenu.style.height = '';
  }
};
</script>
<script setup lang="ts">
import { computed, onMounted, ref, watch, inject, type Ref } from 'vue';
import Lucide from '@/base-components/Lucide';
import iconApps from '@/assets/images/apps.svg';
import Breadcrumb from '@/base-components/Breadcrumb';
import { FormInput } from '@/base-components/Form';
import { Menu, Popover } from '@/base-components/Headless';
import { TransitionRoot } from '@headlessui/vue';
import ErrorNotification from './ErrorNotification.vue';
import { type Menu as SideMenu, useSideMenuStore, menuInTrees, findMenusWithPath, MenuWithPath } from '@/stores/components/menu/side-menu';
import { gotoMenu } from '@/components/SideMenu';
import SideMenuTooltip from '@/components/SideMenu/SideMenuTooltip.vue';
import DarkModeSwitcher from '@/components/DarkModeSwitcher';
import MainColorSwitcher from '@/components/MainColorSwitcher';
import Tippy from '@/base-components/Tippy';
import { userAvatar, ucStore, SearchUser, UserInfoForSearch } from '@/stores/apps/uc';

const ucInfo = ucStore();
const route = useRoute();
const router = useRouter();
/***BEGIN: 菜单栏位置固定***/
const layoutScrollLockIcon = computed(() => {
  return layoutScrollLockStore().locked ? 'LayoutLock' : 'LayoutUnlock';
});

const layoutScrollLockTitle = computed(() => {
  return layoutScrollLockStore().locked ? '点击以解锁菜单栏位置固定，允许菜单栏随页面一同滚动.' : '点击以固定菜单位置.';
});
/***END: 菜单栏位置固定***/

/*** BEGIN: 搜索 ***/
const searchKeyword = ref('');
const searchAppResult = ref<MenuWithPath[]>();
const searchUserResult = ref<UserInfoForSearch[]>();
const errorNotificationMsg = ref('');
let searchErrorCount = 1;
const doSearch = (s: string, o: string) => {
  s = s.trim();
  o = o.trim();
  /**BEGIN 搜索菜单 **/
  if (s === '' || s == o) {
    if (o !== '') {
      // 清空上次搜索结果
      searchAppResult.value = [];
      searchUserResult.value = [];
    }
    return;
  }
  const outMenu: MenuWithPath[] = [];
  findMenusWithPath(s, outMenu);
  searchAppResult.value = outMenu;
  /**END 搜索菜单 **/

  /**BEGIN 搜索用户 **/
  // 延时搜索,避免调用接口太过频繁.
  setTimeout(() => {
    // 搜索目标已更新,放弃上次的搜索
    if (searchKeyword.value != s) {
      return;
    }
    SearchUser(
      s,
      u => {
        searchUserResult.value = u.userList;
      },
      why => {
        errorNotificationMsg.value = `${searchErrorCount++}. 搜索用户出错: ${why.code} ${decodeURIComponent(why.message)}`;
      }
    );
  }, 800);
  /**END 搜索用户 **/
};
watch(searchKeyword, doSearch);
const searchDropdown = ref(false);
let searchInputActive = false;
let searchDropdownPanelActive = false;
const showSearchDropdown = () => {
  searchInputActive = true;
  searchDropdownPanelActive = true;
  searchDropdown.value = true;
};
const SetSearchDropdownActive = () => {
  searchDropdownPanelActive = true;
};
/**
 * 当搜索框失焦时关闭下拉面板
 */
const tryHideSearchDropdownByInput = () => {
  searchInputActive = false;
  hideSearchDropdown();
};
/**
 * 当鼠标移除下拉面板时,关闭下拉面板
 */
const tryHideSearchDropdownByPanel = () => {
  searchDropdownPanelActive = false;
  hideSearchDropdown();
};
/**
 * 延时关闭下拉面板(当搜索框失焦，并且鼠标不在面板上时)。
 */
const hideSearchDropdown = () => {
  if (searchInputActive || searchDropdownPanelActive) {
    // 以防输入框再次被聚焦,处于输入状态, 并且鼠标并未移出下拉面板，则取消上次的隐藏操作.
    return;
  }
  setTimeout(() => {
    if (searchInputActive || searchDropdownPanelActive) {
      return;
    }
    searchDropdown.value = false;
  }, 800);
};
/*** END: 搜索 ***/

/** BEGIN: 面包屑导航 **/
const menuPath = computed((): SideMenu[] => {
  let paths: SideMenu[] = [];
  if (!route || !route.name) {
    return paths;
  }
  menuInTrees(route.name, useSideMenuStore.value.menu, paths);
  return paths;
});
/** END: 面包屑导航 **/

onMounted(() => {
  const layoutMounted = inject<Ref<boolean> | undefined>('layoutMounted', undefined);
  // 监听layout组件的mount情况，以防在子组件(TopBar)中执行时，依赖的部分组件还未加载而取不到相关dom对象.
  // 如果未provide layoutMounted，则回退为自身加载后执行.
  if (!layoutMounted) {
    toggleLayoutScroll(undefined, true);
  } else {
    watch(layoutMounted, mounted => {
      if (mounted) toggleLayoutScroll(undefined, true);
    });
  }
  window.addEventListener('resize', () => {
    toggleLayoutScroll(undefined, true);
  });
});
// 导入退出登录方法.
const logout = inject<() => void>('logout');
</script>
<template>
  <!-- BEGIN: Top Bar -->
  <div class="h-[70px] z-[51] bg-primary/100 dark:bg-darkmode-800 relative border-b border-white/[0.08] mt-12 md:-mt-5 -mx-3 px-3 sm:px-[1rem] md:pt-0">
    <div class="flex items-center h-full">
      <!-- BEGIN: Logo -->
      <RouterLink :to="{ name: 'gvp' }" class="hidden -intro-x md:flex">
        <!-- <logo class="w-10 h-10" /> -->
        <img src="@/assets/images/logo.png" class="w-12" />
        <dl>
          <dt>
            <span class="ml-3 lg:text-sm text-xs text-white">贝吉塔后台管理系统</span>
          </dt>
          <dd class="ml-3 text-xs text-warning pr-1">
            <!-- <img alt="" class="w-12 float-right" :src="logo2Url" /> -->
          </dd>
          <dd class="text-2xs text-slate-500 clear-both">版本: 0.5.0内部试用</dd>
        </dl>
      </RouterLink>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <Breadcrumb light class="h-full md:ml-6 md:pl-5 md:border-l border-white/[0.08] mr-auto -intro-x">
        <Breadcrumb.Link class="pointer-events-none">
          <ul class="flex items-center">
            <li class="pr-1"><img alt="" class="w-4" :src="iconApps" /></li>
            <li class="hidden lg:flex">应用</li>
          </ul>
        </Breadcrumb.Link>
        <Breadcrumb.Link
          v-for="(m, index) in menuPath"
          :to="{ name: m.pageName }"
          :active="m.pageName === route.name"
          :index="index + 1"
          :key="`breadcrumb-link-${index}-${m.title}-${m.pageName === route.name}`"
          :class="[{ 'pointer-events-none': !m.pageName || m.pageName === route.name }]"
        >
          <ul class="flex items-center">
            <li class="pr-1">
              <SideMenuTooltip :content="m.title" placement="bottom">
                <Lucide class="w-4 lg:w-[1rem]" :icon="m.icon" stroke="none" />
              </SideMenuTooltip>
            </li>
            <li class="hidden lg:flex">{{ m.title }}</li>
          </ul>
        </Breadcrumb.Link>
      </Breadcrumb>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: 布局滚动开关 -->
      <Tippy
        :content="layoutScrollLockTitle"
        as="div"
        :options="{ maxWidth: '10rem' }"
        @click="
          () => {
            toggleLayoutScroll();
          }
        "
        class="intro-x mr-2 cursor-pointer hover:rounded-full hover:bg-slate-500/20 p-2"
      >
        <Lucide class="w-5 h-5" :icon="layoutScrollLockIcon" />
      </Tippy>
      <!-- END: 布局滚动开关 -->
      <MainColorSwitcher class="mr-2 intro-x" />
      <DarkModeSwitcher class="mr-2 intro-x" />
      <!-- BEGIN: Search -->
      <div class="relative mr-3 intro-x sm:mr-6">
        <div class="hidden search sm:block">
          <FormInput
            type="text"
            autocomplete="off"
            class="placeholder:text-xs border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
            placeholder="搜索应用、功能或用户..."
            @focus="showSearchDropdown"
            @blur="tryHideSearchDropdownByInput"
            v-model="searchKeyword"
          />
          <Lucide icon="Search" class="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500" />
        </div>
        <span class="relative cursor-pointer text-white/70 sm:hidden" href="">
          <Lucide icon="Search" class="w-5 h-5 dark:text-slate-500" />
        </span>
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
          <div class="absolute right-0 z-50 mt-[3px]">
            <div class="w-[450px] p-5 box max-h-[80vh] overflow-y-scroll" @mouseleave="tryHideSearchDropdownByPanel" @mouseenter="SetSearchDropdownActive">
              <div class="mb-2 font-medium">功能/菜单</div>
              <div v-for="(v, k) in searchAppResult" :key="k" class="mb-1">
                <a
                  href="#"
                  class="flex items-center"
                  @click="
                    () => {
                      gotoMenu(v.menu, router);
                    }
                  "
                >
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/50 dark:bg-primary/50 text-success">
                    <Lucide :icon="v.menu.icon" class="w-4 h-4" stroke="none" />
                  </div>
                  <div class="ml-3">{{ v.menu.title }}</div>
                </a>
                <div class="mt-1 p-1 ml-11 bg-slate-200 dark:bg-darkmode-400/30 text-slate-400 rounded text-xs flex">
                  <a
                    v-for="(pv, pk) in v.path"
                    :key="`${k}-${pk}`"
                    class="flex flex"
                    @click="
                      () => {
                        gotoMenu(pv, router);
                      }
                    "
                    href="#"
                  >
                    <Lucide :icon="pv.icon" class="w-[0.9rem] h-[0.9rem]" stroke="none" />
                    <div class="ml-1">{{ pv.title }}</div>
                    <div v-if="pv.title !== v.menu.title" class="px-1">&gt;</div>
                  </a>
                </div>
              </div>
              <div class="border-b border-slate-200/60 dark:border-darkmode-400 mb-3"></div>
              <div class="mb-2 font-medium">用户</div>
              <div class="mb-5">
                <div class="relative" v-for="(u, i) in searchUserResult" :key="`su-${i}`">
                  <a
                    href=""
                    @click="
                      e => {
                        e.preventDefault();
                      }
                    "
                    onmouseenter="this.nextSibling.style.display='block'"
                    onmouseleave="this.nextSibling.style.display='none'"
                    class="flex items-center mt-2"
                  >
                    <div class="w-8 h-8 image-fit">
                      <img alt="" class="rounded-full" :src="u.avatarPath" />
                    </div>
                    <div class="ml-3">{{ u.userName }}</div>
                    <div class="w-48 ml-auto text-xs text-right truncate text-slate-500">
                      <!-- {{ u.personalMail }} -->
                    </div>
                  </a>
                  <div
                    class="z-[1000] md:-left-[160%] min-w-[20rem] col-span-12 md:col-span-6 lg:col-span-4 fixed hidden"
                    onmouseenter="this.style.display='block'"
                    onmouseleave="this.style.display='none'"
                  >
                    <div class="box bg-slate-200 shadow-md dark:bg-darkmode-400">
                      <div class="flex items-start px-5 py-5">
                        <div class="flex flex-col items-center w-full lg:flex-row">
                          <div class="w-16 h-16 image-fit">
                            <img alt="" class="rounded-full" :src="u.avatarPath" />
                          </div>
                          <div class="mt-3 text-center lg:ml-4 lg:text-left lg:mt-0">
                            <span class="font-medium">{{ u.userName }}</span>
                            <div class="flex flex-col text-slate-500 text-xs mt-0.5">
                              <div>{{ u.gender }}</div>

                              <div class="text-xs text-slate-700 dark:text-slate-400">
                                <!-- <div>{{ u.unitName }}</div>
                                <div>{{ u.departmentName }}</div> -->
                              </div>
                              <div class="flex items-center justify-center lg:justify-start text-slate-500">
                                <Lucide icon="Mail" class="w-3 h-3 mr-2" />
                                <!-- {{ u.personalMail }} -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionRoot>
      </div>
      <!-- END: Search -->
      <!-- BEGIN: Notifications -->
      <Popover class="mr-4 intro-x sm:mr-6">
        <Popover.Button class="relative text-white/70 outline-none block">
          <Lucide icon="Bell" class="w-5 h-5 dark:text-slate-500" />
        </Popover.Button>
        <Popover.Panel class="w-[280px] sm:w-[350px] p-5 mt-2">
          <div class="mb-5 font-medium">通知</div>
        </Popover.Panel>
      </Popover>
      <ErrorNotification :msg="errorNotificationMsg" />
      <!-- END: Notifications -->
      <!-- BEGIN: Account Menu -->
      <Menu>
        <Menu.Button class="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x">
          <img alt="" :src="userAvatar" />
        </Menu.Button>
        <Menu.Items v-if="ucInfo.BasicInfo" class="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
          <Menu.Header class="font-normal">
            <div class="font-medium">
              <RouterLink :to="{ name: 'uc' }">{{ ucInfo.BasicInfo?.fullName }}</RouterLink>
            </div>
            <div class="flex flex-col gap-y-1 text-xs mt-0.5">
              <span class="text-white/70 dark:text-slate-400"></span>
              <span class="text-white/90 dark:text-slate-300">
                <!-- {{ ucInfo.BasicInfo? }} -->
              </span>
              <span class="text-white/90 dark:text-slate-300">
                <!-- {{ ucInfo.BasicInfo? }} -->
              </span>
            </div>
          </Menu.Header>
          <Menu.Devider class="bg-white/[0.08]" />
          <RouterLink :to="{ name: 'uc-profile' }">
            <Menu.Item as="div" class="hover:bg-white/5">
              <Lucide icon="Personal" class="w-4 h-4 mr-2" />
              个人资料
            </Menu.Item>
          </RouterLink>
          <RouterLink :to="{ name: 'uc-password' }">
            <Menu.Item class="hover:bg-white/5">
              <Lucide icon="Lock" class="w-4 h-4 mr-2" />
              修改密码
            </Menu.Item>
          </RouterLink>
          <Menu.Devider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5" @click="logout">
            <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" />
            退出登录
          </Menu.Item>
        </Menu.Items>
        <Menu.Items v-else class="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
          <Menu.Item
            class="hover:bg-white/5"
            @click="
              () => {
                router.push({ name: 'login' });
              }
            "
          >
            <Lucide icon="LogIn" class="w-4 h-4 mr-2" />
            前往登录
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>
