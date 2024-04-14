<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Lucide from "@/base-components/Lucide";
import SideMenuTooltip from "./SideMenuTooltip.vue";
import {type FormattedMenu, FormattedMenuType, linkTo} from "./side-menu";
import {MenuPageName} from "@/stores/components/menu/side-menu";

interface MenuProps {
  class?: string | object;
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenuType)[],
    (computedFormattedMenu: Array<FormattedMenuType>) => void
  ];
  level: "first" | "second" | "third" | "fourth" | "fifth";
}

const router = useRouter();
const props = defineProps<MenuProps>();
</script>

<template>
  <SideMenuTooltip
    as="a"
    :content="props.menu.title"
    :id="`menu-${props.menu.id}`"
    :href="
      props.menu.subMenu
        ? '#'
        : ((pageName: MenuPageName | undefined) => {
            try {
              return router.resolve({
                name: pageName,
              }).fullPath;
            } catch (err) {
              return '';
            }
          })(props.menu.pageName)
    "
    :class="[
      'h-[50px] flex items-center pl-5 text-white mb-1 relative rounded-lg',
      {
        'dark:text-slate-300': props.menu.activeDropdown && props.level !== 'first',
        'text-white/70 dark:text-slate-400':
          !props.menu.activeDropdown && props.level !== 'first',
        'bg-primary dark:bg-transparent':
          (props.menu.activeDropdown || props.menu.active) && props.level === 'first',
        'before:content-[\'\'] before:block before:inset-0 before:bg-white/[0.01] before:rounded-lg before:absolute before:border-b-[2px] before:border-solid before:border-white/50 before:dark:border-white/30 before:dark:bg-darkmode-700':
          (props.menu.activeDropdown || props.menu.active) && props.level === 'first',
        'after:content-[\'\'] after:w-[20px] after:h-[80px] after:mr-[-27px] after:bg-no-repeat after:bg-cover after:absolute after:top-0 after:bottom-0 after:right-0 after:my-auto after:bg-menu-active dark:after:bg-menu-active-dark':
          props.menu.active,
        'hover:bg-primary/60 hover:dark:bg-transparent hover:before:block hover:before:inset-0 hover:before:bg-white/[0.04] hover:before:rounded-lg hover:before:absolute hover:before:z-[-1] hover:before:dark:bg-darkmode-700':
          !props.menu.activeDropdown &&
          props.level === 'first',
        // Animation
        'after:mr-[-47px] after:opacity-0 after:animate-[0.3s_ease-in-out_1s_active-side-menu-chevron] after:animate-fill-mode-forwards':
          props.menu.active && props.level === 'first',
        'bg-white/[0.1] dark:bg-white/[0.08]': props.menu.active && props.menu.pageName === router.currentRoute.value.name
      },
      props.class,
    ]"
    @click="(event: MouseEvent) => {
        event.preventDefault();
        linkTo(props.menu, router);
    }"
  >
    <div
      :class="{
        'z-10 dark:text-slate-300': (props.menu.activeDropdown || props.menu.active) && props.level === 'first',
        'dark:text-slate-400': !props.menu.activeDropdown && props.level === 'first',
      }"
    >
      <Lucide :icon="props.menu.icon" stroke="none" />
    </div>
    <div
      :class="[
        'hidden xl:flex items-center w-full ml-3',
        { 'font-medium': props.menu.activeDropdown && props.level !== 'first' },
        {
          'font-medium z-10 dark:text-slate-300':
            (props.menu.activeDropdown || props.menu.active) && props.level === 'first',
        },
        {
          'dark:text-slate-400': !props.menu.activeDropdown && !props.menu.active && props.level === 'first',
        },
      ]"
    >
      {{ props.menu.title }}
      <div
        v-if="props.menu.subMenu"
        :class="[
          'transition ease-in duration-100 ml-auto mr-5 hidden xl:block',
          { 'transform rotate-180': props.menu.activeDropdown },
        ]"
      >
        <Lucide class="w-4 h-4" icon="ChevronDown" />
      </div>
    </div>
  </SideMenuTooltip>
</template>
