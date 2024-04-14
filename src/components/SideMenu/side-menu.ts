import type {Router, RouteLocationNormalizedLoaded} from "vue-router";
import type {Menu, MenuType} from "@/stores/components/menu/side-menu";
import {slideUp, slideDown} from "@/utils/helper";
import {formattedMenu} from "./MenuItems.vue";
import {ref} from "vue";

interface Route extends RouteLocationNormalizedLoaded {
    forceActiveMenu?: string;
}

export interface FormattedMenu extends Menu {
    active?: boolean;
    activeDropdown?: boolean;
    id: number;
    subMenu?: FormattedMenu[];
}

export type FormattedMenuType = FormattedMenu | "devider"

/**
 *
 * @param subMenu
 * @param route
 * @param setActiveState 如果为活跃菜单，则直接将其设置为active.
 */
const hasActiveSubMenuSet = (subMenu: Menu[] | FormattedMenu[], route: Route, setActiveState?: boolean): boolean => {
    let matchSome = false;
    for (let i = 0; i < subMenu.length; i++) {
        let item = subMenu[i];
        if (item.ignore) {
            continue;
        }
        if (
            (route.forceActiveMenu !== undefined && item.pageName === route.forceActiveMenu)
            || item.pageName === route.name
        ) {
            matchSome = true;
            if (!setActiveState) {
                // 不再检查或递归检查并设置其他menu及子menu
                return true;
            }
            (item as FormattedMenu).active = true;
        } else if (item.subMenu) {//检查子菜单
            let match = hasActiveSubMenuSet(item.subMenu, route, setActiveState);
            if (match) {
                matchSome = true;
                if (!setActiveState) {
                    // 不再检查或递归检查并设置其他menu及子menu
                    return true;
                }
            }
            (item as FormattedMenu).active = match;
        } else {
            (item as FormattedMenu).active = false;
        }
    }
    return matchSome;
};
/**
 * 查找并返回指定菜单, 如果菜单包含子菜单,则展开其子菜单
 * @param id 菜单id
 * @param menus
 */
const findAndActivateFormattedMenuDropdown = (id: number, menus: FormattedMenuType[]): FormattedMenu | undefined => {
    for (let i = 0; i < menus.length; i++) {
        if (typeof menus[i] == "string") {
            continue;
        }
        let m = menus[i] as FormattedMenu;
        if (m.id == id) {
            m.activeDropdown = m.subMenu && true;
            return m;
        } else {
            if (m.subMenu) {
                let menu = findAndActivateFormattedMenuDropdown(id, m.subMenu as FormattedMenu[]);
                if (menu) {
                    m.activeDropdown = true;
                    menu.activeDropdown = menu.subMenu && true;
                    return menu;
                }
            }
        }
    }
}
/**
 * 根据当前路由及菜单,更新菜单的active状态.
 * @param formattedMenu
 * @param route
 */
export const updateMenuActiveStates = (formattedMenu: FormattedMenuType[], route: Route) => {
    formattedMenu.forEach((item) => {
        if (typeof item == "string") {
            return;
        }
        let hasActiveSubMenu = item.subMenu && hasActiveSubMenuSet(item.subMenu, route, true);
        item.active = !item.ignore && (
            (route.forceActiveMenu !== undefined && item.pageName === route.forceActiveMenu) ||
            (item.pageName === route.name) ||
            hasActiveSubMenu
        );
    });
}

/**
 * 生成初始格式化菜单.
 * @param menu
 * @param route
 */
const nestedMenu = (menu: Array<MenuType>, route: Route) => {
    const formattedMenu: Array<FormattedMenuType> = [];
    menu.forEach((item) => {
        if (typeof item == "string") {
            formattedMenu.push(item);
            return;
        }
        const menuItem: FormattedMenu = {
            icon: item.icon,
            title: item.title,
            pageName: item.pageName,
            id: item.id,
            subMenu: item.subMenu,
            ignore: item.ignore,
        };
        let hasActiveSubMenu = item.subMenu && hasActiveSubMenuSet(item.subMenu, route);
        menuItem.active =
            (
                (route.forceActiveMenu !== undefined && menuItem.pageName === route.forceActiveMenu) ||
                menuItem.pageName === route.name ||
                hasActiveSubMenu
            )
            && !menuItem.ignore;

        if (menuItem.subMenu) {
            menuItem.activeDropdown = hasActiveSubMenu;

            // Nested menu
            const subMenu: Array<FormattedMenu> = [];
            nestedMenu(menuItem.subMenu, route).map(
                (menu) => typeof menu !== "string" && subMenu.push(menu)
            );
            menuItem.subMenu = subMenu;
        }
        formattedMenu.push(menuItem);
    });

    return formattedMenu;
};
export const gotoMenu = (menu: Menu, router: Router) => {
    // 排除不在菜单中显示的项
    if (!menu.ignore) {
        let fm = findAndActivateFormattedMenuDropdown(menu.id, formattedMenu);
        if (fm === undefined) {
            return;
        }
        const elSideMenu = document.getElementById("sideMenu");
        if (elSideMenu) {
            let tryCount = 5;
            // 菜单可能被隐藏,等到展开动画结束后重试几次
            let tryScrollTo = () => {
                if (tryCount-- < 0) {
                    return;
                }
                let elMenu = elSideMenu.querySelector(`#menu-${fm!.id}`);
                let elMenuWP = elSideMenu.querySelector(`#menu-wp-${fm!.id}`);
                if (elMenu) {
                    // 设置延时,否则在chrome下会有无法滚动的bug;
                    setTimeout(() => {
                        if (elMenu) {
                            elMenu.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                                inline: "nearest",
                            });
                            // 闪烁提醒特效
                            if (elMenuWP) {
                                elMenuWP.classList.add('box-blink-primary-5');
                                setTimeout(() => {
                                    if (elMenuWP)
                                        elMenuWP.classList.remove('box-blink-primary-5');
                                }, 5000);
                            }
                        }
                    }, 1000);
                } else {
                    setTimeout(tryScrollTo, 800);
                }
            }
            tryScrollTo();
        }
    }
    linkTo(menu, router, true);
}
const linkTo = (menu: FormattedMenu, router: Router, forceDropDown?: boolean) => {
    if (menu.subMenu) {
        menu.activeDropdown = forceDropDown ? true : !menu.activeDropdown;
    }
    if (menu.pageName !== undefined) {
        router.push({
            name: menu.pageName,
        });
    }
};

const enter = (el: Element) => {
    slideDown(el, 300);
};

const leave = (el: Element) => {
    slideUp(el, 300);
};

/**
 * 清空menus1中的菜单，并用menus2中的菜单填充menus1.
 * @param menus1
 * @param menus2
 * @param keepMenuState 是否保持menus1中单展开状态
 */
const assignMenus = (menus1: Array<FormattedMenuType>, menus2: Array<FormattedMenuType>, keepMenuState?: Boolean) => {
    let _om = menus1.splice(0, menus1.length);
    if (!keepMenuState) {
        Object.assign(menus1, menus2)
    } else {
        for (let i = 0; i < menus2.length; i++) {
            if (typeof menus2[i] == "object" && typeof _om[i] == "object") {
                let nm = (menus2[i] as FormattedMenu);
                let om = (_om[i] as FormattedMenu);
                nm.activeDropdown = om.activeDropdown;
                if (nm.subMenu && om.subMenu) {
                    assignMenus(om.subMenu, nm.subMenu, keepMenuState);
                }
            }
        }
        Object.assign(menus1, menus2);
    }

}
export {nestedMenu, linkTo, enter, leave, assignMenus};
