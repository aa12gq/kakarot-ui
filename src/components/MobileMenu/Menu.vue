<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Lucide from "@/base-components/Lucide";
import type {FormattedMenu, FormattedMenuType} from "@/components/SideMenu/side-menu";
import { linkTo } from "./mobile-menu";
import {MenuPageName} from "@/stores/components/menu/side-menu";

interface MenuProps {
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenuType)[],
    (computedFormattedMenu: Array<FormattedMenuType>) => void
  ];
  level: "first" | "second" | "third" | "fourth" | "fifth";
  setActiveMobileMenu: (active: boolean) => void;
}

const router = useRouter();
const props = defineProps<MenuProps>();
const [formattedMenu, setFormattedMenu] = props.formattedMenuState;
</script>

<template>
  <a
    :href="
      props.menu.subMenu 
        ? '#' 
        : ((pageName: MenuPageName) => {
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
      'h-[50px] flex items-center text-white',
      props.level === 'first' && 'px-6',
      props.level !== 'first' && 'px-4',
    ]"
    @click="
      (event) => {
        event.preventDefault();
        linkTo(props.menu, router, props.setActiveMobileMenu);
        setFormattedMenu([...formattedMenu]);
      }
    "
  >
    <div>
      <Lucide :icon="props.menu.icon" />
    </div>
    <div class="flex items-center w-full ml-3">
      {{ props.menu.title }}
      <div
        v-if="props.menu.subMenu"
        :class="[
          'transition ease-in duration-100 ml-auto',
          props.menu.activeDropdown && 'transform rotate-180',
        ]"
      >
        <Lucide icon="ChevronDown" class="w-5 h-5" />
      </div>
    </div>
  </a>
</template>
