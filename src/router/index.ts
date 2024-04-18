import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/apps/Home.vue';
import GVPView from '@/apps/gvp/GlobalViewPanel.vue';
import ScanTaskView from '@/apps/wscc/ScanTask.vue';
import UcHomeView from '@/apps/uc/Home.vue';

import LoginView from '@/apps/login/Login.vue';
import _404 from '@/apps/_404.vue';

import SystemUser from '@/apps/system/User.vue';
import SystemRole from '@/apps/system/Role.vue';

import UcProfileView from '@/apps/uc/Profile.vue';
import UcPasswordView from '@/apps/uc/Password.vue';
import WsccRegisterView from '@/apps/wscc/ScanTask.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: _404,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          // 仪表盘
          path: '/',
          name: 'gvp',
          component: GVPView,
        },
        {
          //个人中心
          path: '/uc',
          name: 'uc',
          component: UcHomeView,
          meta: {
            keepAlive: true,
          },
          children: [
            {
              path: '/uc/profile',
              name: 'uc-profile',
              component: UcProfileView,
              meta: {
                keepAlive: true,
              },
            },
            {
              path: '/uc/password',
              name: 'uc-password',
              component: UcPasswordView,
              meta: {
                keepAlive: true,
              },
            },
          ],
        },
        {
          path: '/wscc-scan_task',
          name: 'wscc-scan_task',
          component: WsccRegisterView,
          meta: {
            keepAlive: true,
          },
        },
        {
          name: 'system-user',
          component: SystemUser,
          path: '/system/user',
        },
        {
          name: 'system-role',
          component: SystemRole,
          path: '/system/role',
        },
      ],
    },
  ],
});

export default router;
