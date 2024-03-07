import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import type {Menu} from "@/stores/side-menu";
import { slideUp, slideDown } from "@/utils/helper";

interface Route extends RouteLocationNormalizedLoaded {
  forceActiveMenu?: string;
}

export interface FormattedMenu extends Menu {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
}

// Setup side menu
const findActiveMenu = (subMenu: Menu[], route: Route): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((route.forceActiveMenu !== undefined &&
        item.pageName === route.forceActiveMenu) ||
        (route.forceActiveMenu === undefined &&
          item.pageName === route.name)) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, route);
    }
  });
  return match;
};

const nestedMenu = (menu: Array<Menu | "devider">, route: Route) => {
  const formattedMenu: Array<FormattedMenu | "devider"> = [];
  menu.forEach((item) => {
    if (typeof item !== "string") {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        pageName: item.pageName,
        subMenu: item.subMenu,
        ignore: item.ignore,
      };
      menuItem.active =
        ((route.forceActiveMenu !== undefined &&
          menuItem.pageName === route.forceActiveMenu) ||
          (route.forceActiveMenu === undefined &&
            menuItem.pageName === route.name) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, route))) &&
        !menuItem.ignore;

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, route);

        // Nested menu
        const subMenu: Array<FormattedMenu> = [];
        nestedMenu(menuItem.subMenu, route).map(
          (menu) => typeof menu !== "string" && subMenu.push(menu)
        );
        menuItem.subMenu = subMenu;
      }

      formattedMenu.push(menuItem);
    } else {
      formattedMenu.push(item);
    }
  });

  return formattedMenu;
};

const linkTo = (menu: FormattedMenu, router: Router) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pageName !== undefined) {
      router.push({
        name: menu.pageName,
      });
    }
  }
};

const enter = (el: HTMLElement) => {
  slideDown(el, 300);
};

const leave = (el: HTMLElement) => {
  slideUp(el, 300);
};

/**
 * 清空menus1中的菜单，并用menus2中的菜单填充menus1.
 * @param menus1
 * @param menus2
 * @param keepMenuState 是否保持menus1中单展开状态
 */
const assignMenus = (menus1:Array<FormattedMenu|"devider">, menus2:Array<FormattedMenu|"devider">, keepMenuState?:Boolean) => {
  let _om = menus1.splice(0, menus1.length);
  if(!keepMenuState){
    Object.assign(menus1, menus2)
  } else {
    for(let i = 0; i < menus2.length; i++){
      if(typeof menus2[i] == "object" &&  typeof _om[i] == "object"){
        let nm = (menus2[i] as FormattedMenu);
        let om = (_om[i] as FormattedMenu);
        nm.activeDropdown = om.activeDropdown;
        if(nm.subMenu && om.subMenu){
          assignMenus(om.subMenu, nm.subMenu, keepMenuState);
        }
      }
    }
    Object.assign(menus1, menus2);
  }

}
export { nestedMenu, linkTo, enter, leave, assignMenus };
