<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PromotionRelation } from '#/api/system/promotion';

import { DocAlert, Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { getAncestors, getDescendants, getInviter } from './data';
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
      keyField: 'userId',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<PromotionRelation>,
});

async function handleQuery() {
  const formValues = gridApi.form?.getValues();
  if (formValues?.userId) {
    // 获取推广上下级数据
    const [inviter, descendants, ancestors] = await Promise.all([
      getInviter(formValues.userId),
      getDescendants(formValues.userId),
      getAncestors(formValues.userId),
    ]);
    // 合并数据
    const allData = [ancestors, inviter ? [inviter] : [], descendants]
      .flat()
      .filter((item): item is PromotionRelation => item !== null && item !== undefined);
    gridApi.grid?.loadData(allData);
  }
}
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="三级分销推广关系"
        url="https://doc.iocoder.cn/promotion/"
      />
    </template>

    <Grid table-title="推广关系列表" @query="handleQuery" />
  </Page>
</template>