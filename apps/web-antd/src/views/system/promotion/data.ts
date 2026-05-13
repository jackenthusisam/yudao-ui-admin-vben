import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PromotionRelation } from '#/api/system/promotion';

import { ref } from 'vue';

export const useGridColumns = () => {
  return ref([
    { type: 'seq', width: 60 },
    { field: 'userId', title: '用户ID', width: 80 },
    { field: 'nickname', title: '昵称', width: 120 },
    { field: 'mobile', title: '手机号', width: 120 },
    { field: 'inviteCode', title: '邀请码', width: 120 },
    { field: 'level', title: '层级', width: 80 },
    { field: 'inviterNickname', title: '邀请人', width: 120 },
    { field: 'directChildCount', title: '直接下级数', width: 100 },
    { field: 'createTime', title: '注册时间', width: 160 },
  ]);
};

export const useGridFormSchema = () => {
  return ref([
    {
      fieldName: 'userId',
      label: '用户ID',
      component: 'InputNumber',
    },
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

export async function getInviter(userId: number): Promise<PromotionRelation | null> {
  return null;
}

export async function getDescendants(userId: number): Promise<PromotionRelation[]> {
  return [];
}

export async function getAncestors(userId: number): Promise<PromotionRelation[]> {
  return [];
}