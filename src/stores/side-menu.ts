import { defineStore } from 'pinia';
import type { Icon } from '@/base-components/Lucide';

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | 'devider'>;
}

export const useSideMenuStore = defineStore('sideMenu', {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: 'Global1',
        pageName: 'gvp',
        title: '仪表盘',
      },
      {
        icon: 'Budget1',
        title: '超级管理员',
        subMenu: [
          {
            icon: 'Role1',
            title: '用户管理',
          },
        ],
      },
      {
        icon: 'Progress',
        title: '云控管理',
        subMenu: [
          {
            icon: 'EditPlan',
            title: '账号管理',
            subMenu: [
              {
                icon: 'AlterPlan',
                title: '账号注册',
              },
            ],
          },
        ],
      },
      'devider',
      {
        icon: 'MonitorSpeaker',
        title: '系统管理',
        subMenu: [
          {
            icon: 'Role1',
            title: '系统角色',
          },
          {
            icon: 'Flower2',
            title: '流程管理',
          },
          {
            icon: 'Calendar',
            title: '系统参数',
          },
        ],
      },
      {
        icon: 'FileBox',
        title: '帮助文档',
      },
    ],
  }),
});
