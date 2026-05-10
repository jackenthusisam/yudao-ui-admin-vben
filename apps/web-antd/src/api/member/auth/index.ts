import { appRequestClient } from '#/api/request';

export namespace MemberAuthApi {
  /** 手机号登录接口参数 */
  export interface LoginParams {
    mobile: string;
    code?: string;
    password?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    userId: number;
    expiresTime: number;
  }

  /** 注册接口参数（手机号注册） */
  export interface RegisterParams {
    mobile: string;
    password: string;
    tenantId: number;
    captchaVerification?: string;
    inviteCode?: string;
  }

  /** 邀请链接返回值 */
  export interface InviteLinkResult {
    inviteCode: string;
    tenantId: number;
  }
}

/** 手机号登录 */
export async function loginApi(data: MemberAuthApi.LoginParams) {
  return appRequestClient.post<MemberAuthApi.LoginResult>(
    '/member/auth/login',
    data,
    {
      headers: {
        isEncrypt: false,
      },
    },
  );
}

/** 手机号注册 */
export async function register(data: MemberAuthApi.RegisterParams) {
  return appRequestClient.post<MemberAuthApi.LoginResult>(
    '/member/auth/register',
    data,
    {
      headers: {
        isEncrypt: false,
      },
    },
  );
}

/** 获取邀请链接 */
export async function getInviteLink() {
  return appRequestClient.get<MemberAuthApi.InviteLinkResult>(
    '/member/user/get-invite-link',
  );
}

/** 发送短信验证码 */
export async function sendSmsCode(data: { mobile: string; scene: number }) {
  return appRequestClient.post('/member/auth/send-sms-code', data);
}
