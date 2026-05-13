import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/system/notify-message',
    component: () => import('#/views/system/notify/my/index.vue'),
    name: 'MyNotifyMessage',
    meta: {
      title: '我的站内信',
      icon: 'ant-design:message-filled',
      hideInMenu: true,
    },
  },
  {
    path: '/system/promotion',
    component: () => import('#/views/system/promotion/index.vue'),
    name: 'SystemPromotion',
    meta: {
      title: '推广关系',
      icon: 'lucide:git-branch',
    },
  },
];

export default routes;
