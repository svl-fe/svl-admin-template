import { request } from 'umi';
import type { IRiskCategoryCreateParams, IRiskCategory } from './data';
import type { ITableResult } from '@/common';

const prefix = '/v1/risk';

/**
 * 获取风险条件列表
 */
export async function queryRiskList(params): Promise<ITableResult<IRiskCategory>> {
  return request(`${prefix}/list`, {
    method: 'POST',
    params,
  });
}

/**
 * 创建新的风险
 */
export async function createRisk(data: IRiskCategoryCreateParams): Promise<IRiskCategory> {
  return request(`${prefix}`, {
    method: 'POST',
    data,
  });
}
