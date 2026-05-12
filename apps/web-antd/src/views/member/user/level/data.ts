import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberUserApi } from '#/api/member/user';

import { ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

export const useGridColumns = () => {
  return ref([
    { type: 'seq', width: 60 },
    { field: 'mobile', title: '手机号', width: 120 },
    { field: 'nickname', title: '昵称', width: 120 },
    { field: 'levelName', title: '等级', width: 100 },
    { field: 'experience', title: '经验值', width: 80 },
    { field: 'point', title: '积分', width: 80 },
    { field: 'totalPoint', title: '总积分', width: 80 },
    { field: 'inviteCode', title: '邀请码', width: 120 },
    { field: 'inviteUserId', title: '邀请人ID', width: 100 },
    { field: 'registerIp', title: '注册IP', width: 120 },
    { field: 'createTime', title: '注册时间', width: 160 },
  ]);
};

export const useGridFormSchema = () => {
  return ref([
    {
      fieldName: 'mobile',
      label: '手机号',
      component: 'Input',
    },
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
    },
  ]);
};

export function useGridOptions(): VxeTableGridOptions<MemberUserApi.User> {
  return {
    columns: useGridColumns(),
    height: 'auto',
    pagerConfig: { enabled: true },
    rowConfig: { keyField: 'id', isHover: true },
    toolbarConfig: { refresh: true, search: true },
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          const { getUserPage } = await import('#/api/member/user');
          return await getUserPage(formValues);
        },
      },
    },
  };
}