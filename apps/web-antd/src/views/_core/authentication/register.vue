<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import type { AuthApi } from '#/api/core/auth';
import type { MemberAuthApi } from '#/api/member/auth';

import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { AuthenticationRegister, Verification, z } from '@vben/common-ui';
import { LOGIN_PATH } from '@vben/constants';
import { isCaptchaEnable, isTenantEnable } from '@vben/hooks';
import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';

import { notification } from 'ant-design-vue';

import {
  checkCaptcha,
  getCaptcha,
  getTenantByWebsite,
  getTenantSimpleList,
} from '#/api/core/auth';
import { register } from '#/api/member/auth';

defineOptions({ name: 'Register' });

const loading = ref(false);

const route = useRoute();
const router = useRouter();
const accessStore = useAccessStore();
const tenantEnable = isTenantEnable();
const captchaEnable = isCaptchaEnable();

const registerRef = ref();
const verifyRef = ref();

const captchaType = 'blockPuzzle'; // 验证码类型：'blockPuzzle' | 'clickWord'

function getQueryString(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function getInviteCodeFromQuery() {
  const inviteCode = getQueryString(route.query.inviteCode);
  return typeof inviteCode === 'string' ? inviteCode : undefined;
}

function getTenantIdFromQuery() {
  const tenantId = Number(getQueryString(route.query.tenantId));
  return Number.isFinite(tenantId) && tenantId > 0 ? tenantId : null;
}

function setFormValue(fieldName: string, value?: string) {
  if (value) {
    registerRef.value?.getFormApi().setFieldValue(fieldName, value);
  }
}

/** 获取租户列表，并默认选中 */
const tenantList = ref<AuthApi.TenantResult[]>([]);
async function fetchTenantList() {
  if (!tenantEnable) {
    return;
  }
  try {
    const websiteTenantPromise = getTenantByWebsite(window.location.hostname);
    tenantList.value = await getTenantSimpleList();

    let tenantId: null | number = getTenantIdFromQuery();
    const websiteTenant = await websiteTenantPromise;
    if (!tenantId && websiteTenant?.id) {
      tenantId = websiteTenant.id;
    }
    if (!tenantId && accessStore.tenantId) {
      tenantId = accessStore.tenantId;
    }
    if (!tenantId && tenantList.value?.[0]?.id) {
      tenantId = tenantList.value[0].id;
    }

    if (tenantId) {
      accessStore.setTenantId(tenantId);
      setFormValue('tenantId', tenantId.toString());
    }
  } catch (error) {
    console.error('获取租户列表失败:', error);
  }
}

function buildRegisterParams(values: Record<string, any>) {
  return {
    captchaVerification: values.captchaVerification,
    inviteCode: values.inviteCode || undefined,
    mobile: values.mobile,
    password: values.password,
    tenantId: Number(values.tenantId || accessStore.tenantId),
  } as MemberAuthApi.RegisterParams;
}

/** 执行注册 */
async function handleRegister(values: Record<string, any>) {
  if (captchaEnable && !values.captchaVerification) {
    verifyRef.value.show();
    return;
  }

  loading.value = true;
  try {
    await register(buildRegisterParams(values));
    notification.success({
      description: '注册成功，请使用手机号和密码登录',
      duration: 3,
      message: '注册成功',
    });
    await router.push(LOGIN_PATH);
  } catch (error) {
    console.error('注册失败:', error);
    notification.error({
      description: (error as Error)?.message || '注册失败，请稍后重试',
      duration: 3,
      message: '注册失败',
    });
  } finally {
    loading.value = false;
  }
}

/** 验证码通过，执行注册 */
async function handleVerifySuccess({ captchaVerification }: any) {
  try {
    const values = await registerRef.value.getFormApi().getValues();
    await handleRegister({ ...values, captchaVerification });
  } catch (error) {
    console.error('Error in handleRegister:', error);
  }
}

onMounted(() => {
  fetchTenantList();
  setFormValue('inviteCode', getInviteCodeFromQuery());
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        options: tenantList.value.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
        placeholder: $t('authentication.tenantTip'),
      },
      fieldName: 'tenantId',
      label: $t('authentication.tenant'),
      rules: z.string().min(1, { message: $t('authentication.tenantTip') }),
      dependencies: {
        triggerFields: ['tenantId'],
        if: tenantEnable,
        trigger(values) {
          if (values.tenantId) {
            accessStore.setTenantId(Number(values.tenantId));
          }
        },
      },
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.mobileTip'),
      },
      fieldName: 'mobile',
      label: $t('authentication.mobile'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.mobileTip') })
        .regex(/^1[3-9]\d{9}$/, {
          message: $t('authentication.mobileFormatTip'),
        }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入邀请码（可选）',
      },
      fieldName: 'inviteCode',
      label: '邀请码',
      rules: z.string().optional(),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.passwordStrength'),
        };
      },
      rules: z
        .string()
        .min(4, { message: '密码长度为 4-16 位' })
        .max(16, { message: '密码长度为 4-16 位' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.confirmPassword'),
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ required_error: $t('authentication.passwordTip') })
            .min(1, { message: $t('authentication.passwordTip') })
            .refine((value) => value === password, {
              message: $t('authentication.confirmPasswordTip'),
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: $t('authentication.confirmPassword'),
    },
    {
      component: 'VbenCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            $t('authentication.agree'),
            h(
              'a',
              {
                class: 'vben-link ml-1',
                href: '',
              },
              `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`,
            ),
          ]),
      }),
      rules: z.boolean().refine((value) => !!value, {
        message: $t('authentication.agreeTip'),
      }),
    },
  ];
});
</script>

<template>
  <div>
    <AuthenticationRegister
      ref="registerRef"
      :form-schema="formSchema"
      :loading="loading"
      @submit="handleRegister"
    />
    <Verification
      ref="verifyRef"
      v-if="captchaEnable"
      :captcha-type="captchaType"
      :check-captcha-api="checkCaptcha"
      :get-captcha-api="getCaptcha"
      :img-size="{ width: '400px', height: '200px' }"
      mode="pop"
      @on-success="handleVerifySuccess"
    />
  </div>
</template>
