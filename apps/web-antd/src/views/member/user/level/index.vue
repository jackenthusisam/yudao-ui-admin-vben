<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberUserApi } from '#/api/member/user';

import { DocAlert, Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useGridColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MemberUserApi.User>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="会员用户等级"
        url="https://doc.iocoder.cn/member/user/"
      />
    </template>

    <Grid table-title="用户等级列表" />
  </Page>
</template>