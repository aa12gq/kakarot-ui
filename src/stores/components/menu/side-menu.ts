import type { Icon } from '@/base-components/Lucide';
import { menuSlots } from '@/stores/components/menu/menu-slots';
import { UserMenus } from '@/stores/apps/uc/uc';
import { MenuResource } from '@/stores/grpc/system/v1/auth';
import { RouteRecordName } from 'vue-router';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export type pageName = RouteRecordName;
export type MenuPageName = pageName | undefined;

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: pageName;
  id: number;
  subMenu?: Menu[];
  // 不显示菜单
  ignore?: boolean;
  href?: string;
}

export type MenuType = Menu | 'devider';

export interface SideMenuState {
  menu: Array<MenuType>;
}

export interface MenuWithPath {
  menu: Menu;
  path: Menu[];
}

/**
 * 整个菜单数中是否存在包含指定页面的菜单.并生成页面的导航路径(面包屑)pathMenu
 * @param pageName
 * @param menus
 * @param pathMenu
 */
export const menuInTrees = (pageName: string | symbol, menus: Array<MenuType>, pathMenu: Menu[]): boolean => {
  let exist = false;
  for (let i = 0; i < menus.length; i++) {
    let m = menus[i];
    if (typeof m == 'object') {
      if (m.pageName == pageName) {
        pathMenu.unshift(m);
        exist = true;
      }
      if (m.subMenu && menuInTrees(pageName, m.subMenu, pathMenu)) {
        pathMenu.unshift(m);
        exist = true;
      }
    }
  }
  return exist;
};
export const findMenu = (pageName: string | symbol, allMenus?: Array<MenuType>): Menu | undefined => {
  if (!allMenus) {
    allMenus = useSideMenuStore.value.menu;
  }
  for (let i = 0; i < allMenus.length; i++) {
    let m = allMenus[i];
    if (typeof m == 'object') {
      if (m.pageName == pageName) {
        return m;
      }
      if (m.subMenu) {
        let sm = findMenu(pageName, m.subMenu);
        if (sm) {
          return sm;
        }
      }
    }
  }
};
/**
 * 通过title模糊搜索所有菜单(包含其路径).
 * @param title  菜单名称
 * @param outMenus 所匹配的菜单
 * @param menuPath 菜单路径
 * @param allMenus
 */
export const findMenusWithPath = (title: string, outMenus: MenuWithPath[], menuPath?: Menu[], allMenus?: Array<MenuType>) => {
  if (!allMenus) {
    allMenus = useSideMenuStore.value.menu;
  }
  if (menuPath === undefined) {
    menuPath = [];
  }
  for (let i = 0; i < allMenus.length; i++) {
    let m = allMenus[i];
    if (typeof m == 'object') {
      if (title === m.title || m.title.includes(title)) {
        outMenus.push({
          menu: m,
          path: [...menuPath, m],
        });
      }
      if (m.subMenu) {
        findMenusWithPath(title, outMenus, [...menuPath, m], m.subMenu);
      }
    }
  }
};
const userMenus = ref<SideMenuState>({ menu: [] });

export const grantedPages = ref<Record<pageName, boolean>>({});
/**
 * 用户是有页面权限,如果pageName未指定,只判断当前页.
 * @param pageName
 */
export const isPageGranted = computed((): ((pageName?: MenuPageName) => boolean) => {
  return (pageName: MenuPageName): boolean => {
    if (pageName === undefined) {
      const route = useRoute();
      if (route.name) {
        pageName = route.name;
      }
    }
    if (pageName === null || pageName === undefined) {
      return true;
    }
    console.log('grantedPages', pageName, grantedPages.value, grantedPages.value[pageName]);
    return grantedPages.value[pageName];
  };
});

/**
 * 从预配置的menu slots中过滤掉未授权的菜单.
 * @param grantedMenu
 * @param _menuSlots 预配置的菜单
 */
function assembleGrantedMenu(grantedMenu: MenuResource[], _menuSlots: MenuType[]): MenuType[] {
  let matched: MenuType[] = [];
  _menuSlots.forEach(m => {
    if (typeof m !== 'object') {
      matched.push(m);
    } else {
      let mg = grantedMenu.find(v => {
        if (Number(v.id) == m.id) {
          return true;
        }
      });
      if (mg) {
        if (m.pageName !== undefined) {
          grantedPages.value[m.pageName] = true;
        }
        if (m.subMenu) {
          m.subMenu = assembleGrantedMenu(mg.submenu, m.subMenu) as Menu[];
        }
        matched.push(m);
      }
    }
  });
  return matched;
}

export const useSideMenuStore = computed<SideMenuState>(() => {
  return userMenus.value;
});
export const initUserMenu = (): Promise<void> => {
  return UserMenus(
    um => {
      console.log('用户菜单获取成功', assembleGrantedMenu(um, menuSlots.menu));
      userMenus.value = { menu: assembleGrantedMenu(um, menuSlots.menu) };
    },
    why => {
      console.error('用户菜单获取失败');
      throw { code: why.code, message: `用户菜单获取失败: ${decodeURIComponent(why.message)}` };
    }
  );
};
