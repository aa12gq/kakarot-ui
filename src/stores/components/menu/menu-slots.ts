import type { SideMenuState } from '@/stores/components/menu/side-menu';
export const menuSlots: SideMenuState = {
  menu: [
    {
      icon: 'User',
      title: '个人中心',
      ignore: true,
      pageName: 'uc',
      id: 1000,
      subMenu: [
        {
          icon: 'Personal',
          title: '个人资料',
          pageName: 'uc-profile',
          id: 1001,
        },
        {
          icon: 'Lock',
          title: '修改密码',
          pageName: 'uc-password',
          id: 1002,
        },
        {
          icon: 'Box',
          title: '偏好设置',
          id: 1003,
        },
      ],
    },
    {
      icon: 'Global1',
      title: '仪表盘',
      // ignore: true,
      pageName: 'gvp',
      id: 2900,
    },
    {
      icon: 'Progress',
      title: '云控管理',
      id: 3000,
      subMenu: [
        {
          icon: 'EditPlan',
          title: '账号管理',
          id: 3100,
          subMenu: [
            {
              icon: 'AlterPlan',
              title: '账号注册',
              pageName: 'wscc-scan_task',
              id: 3101,
            },
          ],
        },
      ],
    },
    'devider',
    {
      icon: 'SystemSettings2',
      title: '系统管理',
      id: 10000,
      subMenu: [
        {
          icon: 'Role2',
          title: '系统用户',
          pageName: 'system-user',
          id: 11000,
        },
        {
          icon: 'Role1',
          title: '系统角色',
          pageName: 'system-role',
          id: 11010,
        },
        {
          icon: 'Flow',
          title: '流程管理',
          id: 11020,
        },
        {
          icon: 'Params',
          title: '系统参数',
          id: 11030,
        },
        {
          icon: 'OpAudit2',
          title: '操作审计',
          id: 11050,
        },
        {
          icon: 'AppManage',
          title: '应用管理',
          pageName: 'system-app',
          id: 11060,
        },
      ],
    },
    {
      icon: 'HelpDocs1',
      title: '帮助文档',
      id: 12000,
    },
    {
      icon: 'AboutUs',
      title: '关于我们',
      id: 12100,
    },
  ],
};
