<script setup lang="ts">
import Devider from "@/components/SideMenu/Devider.vue";
import Menu from "@/components/SideMenu/Menu.vue";
import {useSideMenuStore} from "@/stores/side-menu";
import type {FormattedMenu} from "@/components/SideMenu/side-menu";
import {enter, leave, nestedMenu, assignMenus} from "@/components/SideMenu/side-menu";
import {computed, onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router";

interface MenuItemsProps {
  // 切换页面时, 是否保持菜单状态. 否则只会展开当前页面所对应的菜单, 并关闭其他所有菜单.
  keepMenuState?: boolean
}
const props = defineProps<MenuItemsProps>();

const route = useRoute();
let formattedMenu = reactive<Array<FormattedMenu | "devider">>([]);
const setFormattedMenu = (
    computedFormattedMenu: Array<FormattedMenu | "devider">
) => {
  assignMenus(formattedMenu, computedFormattedMenu, props.keepMenuState);
};
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

watch(sideMenu, () => {
    setFormattedMenu(sideMenu.value);
});

onMounted(() => {
  setFormattedMenu(sideMenu.value);
});
</script>
<template>
  <nav
      class="hidden md:block w-[105px] xl:w-[250px] px-5 pt-8 pb-16 overflow-x-hidden"
  >
    <ul>
      <!-- BEGIN: First Child -->
      <template v-for="(menu, menuKey) in formattedMenu">
        <Devider
            v-if="menu == 'devider'"
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
        <li v-else :key="menuKey">
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
          <!-- BEGIN: Second Child -->
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
              >
                <Menu
                    :class="`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                          (subMenuKey + 1) * 10
                        }`"
                    :menu="subMenu"
                    :formattedMenuState="[formattedMenu, setFormattedMenu]"
                    level="second"
                ></Menu>
                <!-- BEGIN: Third Child -->
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
                    >
                      <Menu
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
                      <!-- BEGIN: Fourth Child -->
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
                          >
                            <Menu
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
                          </li>
                        </ul>
                      </Transition>
                      <!-- END: Fourth Child -->
                    </li>
                  </ul>
                </Transition>
                <!-- END: Third Child -->
              </li>
            </ul>
          </Transition>
          <!-- END: Second Child -->
        </li>
      </template>
      <!-- END: First Child -->
    </ul>
  </nav>
</template>