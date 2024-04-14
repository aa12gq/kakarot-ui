<script lang="ts">
export default {
};
import {reactive} from "vue";
import {FormattedMenuType} from "@/components/SideMenu/side-menu";
export const formattedMenu = reactive<Array<FormattedMenuType>>([]);
</script>
<script setup lang="ts">
import Devider from "@/components/SideMenu/Devider.vue";
import Menu from "@/components/SideMenu/Menu.vue";
import {useSideMenuStore} from "@/stores/components/menu/side-menu";
import {enter, leave, nestedMenu, assignMenus, updateMenuActiveStates} from "./side-menu";
import {onMounted, watch} from "vue";
import {useRoute} from "vue-router";

interface MenuItemsProps {
  // 切换页面时, 是否保持菜单状态. 否则只会展开当前页面所对应的菜单, 并关闭其他所有菜单.
  keepMenuState?: boolean
}

const props = defineProps<MenuItemsProps>();

const route = useRoute();

const setFormattedMenu = (
    computedFormattedMenu: Array<FormattedMenuType>
) => {
  assignMenus(formattedMenu, computedFormattedMenu, props.keepMenuState);
};
const sideMenu = nestedMenu(useSideMenuStore.value.menu, route);

watch(useSideMenuStore, (v) => {
  setFormattedMenu(nestedMenu(v.menu, route));
});
watch(route,  ()=>{
  updateMenuActiveStates(formattedMenu, route);
});

onMounted(() => {
  setFormattedMenu(sideMenu);
});
</script>
<template>
  <nav
      class="hidden md:block w-[105px] xl:w-[250px] px-5 pb-16 overflow-x-hidden  border-t-[1.2rem] rounded-[0.6rem] border-black/[0.001] dark:border-black/[0.001]"
      id="sideMenu"
  >
    <ul>
      <!-- BEGIN: First Level Child -->
      <template v-for="(menu, menuKey) in formattedMenu">
        <Devider
            v-if="menu === 'devider'"
            type="li"
            :class="[
                  'my-6',
                  // Animation
                  `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-devider] animate-fill-mode-forwards animate-delay-${
                    (menuKey + 1) * 10
                  }`,
                ]"
            :key="'devider-' + menuKey"
        ></Devider>
        <li v-else-if="!menu.ignore" :key="menuKey" :id="`menu-wp-${menu.id}`">
          <Menu
              :class="{
                    // Animation
                    [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                      (menuKey + 1) * 10
                    }`]: !menu.active,
                  }"
              :menu="menu"
              :formattedMenuState="[formattedMenu, setFormattedMenu]"
              level="first"
          ></Menu>
          <!-- BEGIN: Second Level Child -->
          <Transition @enter="enter" @leave="leave">
            <ul
                v-if="menu.subMenu && menu.activeDropdown"
                :class="[
                      'bg-white/[0.08] rounded-lg relative dark:bg-transparent',
                      'before:content-[\'\'] before:block before:inset-0 before:bg-primary/60 before:rounded-lg before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                      {
                        block: menu.activeDropdown,
                      },
                      { hidden: !menu.activeDropdown },
                    ]"
            >
              <li
                  v-for="(subMenu, subMenuKey) in menu.subMenu"
                  :key="subMenuKey"
                  :id="`menu-wp-${subMenu.id}`"
              >
                <Menu v-if="!subMenu.ignore"
                      :class="`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                          (subMenuKey + 1) * 10
                        }`"
                      :menu="subMenu"
                      :formattedMenuState="[formattedMenu, setFormattedMenu]"
                      level="second"
                ></Menu>
                <!-- BEGIN: Third Level Child -->
                <Transition
                    @enter="enter"
                    @leave="leave"
                    v-if="subMenu.subMenu"
                >
                  <ul
                      v-if="subMenu.subMenu && subMenu.activeDropdown"
                      :class="[
                            'bg-white/[0.08] rounded-lg relative dark:bg-transparent',
                            'before:content-[\'\'] before:block before:inset-0 before:bg-primary/60 before:rounded-lg before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                            {
                              block: subMenu.activeDropdown,
                            },
                            { hidden: !subMenu.activeDropdown },
                          ]"
                  >
                    <li
                        v-for="(
                              thirdSubMenu, thirdSubMenuKey
                            ) in subMenu.subMenu"
                        :key="thirdSubMenuKey"
                        :id="`menu-wp-${thirdSubMenu.id}`"
                    >
                      <Menu v-if="!thirdSubMenu.ignore"
                            :class="`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                (thirdSubMenuKey + 1) * 10
                              }`"
                            :menu="thirdSubMenu"
                            :formattedMenuState="[
                                formattedMenu,
                                setFormattedMenu,
                              ]"
                            level="third"
                      ></Menu>
                      <!-- BEGIN: Fourth Level Child -->
                      <Transition
                          @enter="enter"
                          @leave="leave"
                          v-if="thirdSubMenu.subMenu"
                      >
                        <ul
                            v-if="thirdSubMenu.subMenu && thirdSubMenu.activeDropdown"
                            :class="[
                            'bg-white/[0.08] rounded-lg relative dark:bg-transparent',
                            'before:content-[\'\'] before:block before:inset-0 before:bg-primary/60 before:rounded-lg before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                            {
                              block: thirdSubMenu.activeDropdown,
                            },
                            { hidden: !thirdSubMenu.activeDropdown },
                          ]"
                        >
                          <li
                              v-for="(
                              fourthSubMenu, fourthSubMenuKey
                            ) in thirdSubMenu.subMenu"
                              :key="fourthSubMenuKey"
                              :id="`menu-wp-${fourthSubMenu.id}`"
                          >
                            <Menu v-if="!fourthSubMenu.ignore"
                                  :class="`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                (fourthSubMenuKey + 1) * 10
                              }`"
                                  :menu="fourthSubMenu"
                                  :formattedMenuState="[
                                formattedMenu,
                                setFormattedMenu,
                              ]"
                                  level="fourth"
                            ></Menu>
                            <!-- BEGIN: Fifth Level Child -->
                            <Transition
                                @enter="enter"
                                @leave="leave"
                                v-if="fourthSubMenu.subMenu"
                            >
                              <ul
                                  v-if="fourthSubMenu.subMenu && fourthSubMenu.activeDropdown"
                                  :class="[
                            'bg-white/[0.08] rounded-lg relative dark:bg-transparent',
                            'before:content-[\'\'] before:block before:inset-0 before:bg-primary/60 before:rounded-lg before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                            {
                              block: fourthSubMenu.activeDropdown,
                            },
                            { hidden: !fourthSubMenu.activeDropdown },
                          ]"
                              >
                                <li
                                    v-for="(
                              fifthSubMenu, fifthSubMenuKey
                            ) in fourthSubMenu.subMenu"
                                    :key="fifthSubMenuKey"
                                    :id="`menu-wp-${fifthSubMenu.id}`"
                                >
                                  <Menu v-if="!fifthSubMenu.ignore"
                                        :class="`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                (fifthSubMenuKey + 1) * 10
                              }`"
                                        :menu="fifthSubMenu"
                                        :formattedMenuState="[
                                formattedMenu,
                                setFormattedMenu,
                              ]"
                                        level="fifth"
                                  ></Menu>
                                </li>
                              </ul>
                            </Transition>
                            <!-- END: Fifth Level Child -->
                          </li>
                        </ul>
                      </Transition>
                      <!-- END: Fourth Level Child -->
                    </li>
                  </ul>
                </Transition>
                <!-- END: Third Level Child -->
              </li>
            </ul>
          </Transition>
          <!-- END: Second Level Child -->
        </li>
      </template>
      <!-- END: First Level Child -->
    </ul>
  </nav>
</template>