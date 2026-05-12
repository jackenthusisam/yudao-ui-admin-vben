import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/member/user',
    component: () => import('#/views/member/user/index.vue'),
    name: 'MemberUser',
    meta: {
      title: '会员用户',
      icon: 'lucide:user',
    },
  },
  {
    path: '/member/user/level',
    component: () => import('#/views/member/user/level/index.vue'),
    name: 'MemberUserLevel',
    meta: {
      title: '会员等级',
      icon: 'lucide:award',
    },
  },
  {
    path: '/member/user/detail',
    component: () => import('#/views/member/user/detail/index.vue'),
    name: 'MemberUserDetail',
    meta: {
      title: '会员详情',
      icon: 'lucide:user',
      activePath: '/member/user',
      hideInMenu: true,
    },
  },
];

export default routes;
