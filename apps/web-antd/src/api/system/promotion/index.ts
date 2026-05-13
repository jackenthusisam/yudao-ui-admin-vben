import type { ApiRequestOptions } from '#/api/request';
import { requestClient } from '#/api/request';

export interface PromotionRelation {
  userId: number;
  nickname: string;
  mobile: string;
  inviteCode: string;
  inviterId: number | null;
  inviterNickname: string;
  level: number;
  directChildCount: number;
  createTime: string;
}

/**
 * 获取用户的邀请人
 */
export async function getInviter(userId: number): Promise<PromotionRelation | null> {
  return requestClient.get(`/system/promotion/inviter/${userId}`);
}

/**
 * 获取用户的下级（递归三级）
 */
export async function getDescendants(userId: number): Promise<PromotionRelation[]> {
  return requestClient.get(`/system/promotion/descendants/${userId}`);
}

/**
 * 获取用户的推广链路（向上三级）
 */
export async function getAncestors(userId: number): Promise<PromotionRelation[]> {
  return requestClient.get(`/system/promotion/ancestors/${userId}`);
}

/**
 * 生成邀请码（测试用）
 */
export async function generateInviteCode(): Promise<string> {
  return requestClient.get('/system/promotion/generate-code');
}