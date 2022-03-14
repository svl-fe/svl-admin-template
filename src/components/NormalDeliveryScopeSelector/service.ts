import { request } from 'umi';
import type { ITableResult, ITableQuery } from '@/common';
import type { IEquipment, ITypeTreeParams } from './data';
const prefix = '/v1/behaviorrule';
/**
 * 获取类型树
 */
export async function getTypeTree(params: ITypeTreeParams) {
  return request(`${prefix}/relation/tree`, {
    method: 'POST',
    params,
  });
}
/**
 * 获取类型树
 */
export async function getEquipmentList(params: ITableQuery): Promise<ITableResult<IEquipment>> {
  return request(`${prefix}/device/list`, {
    method: 'POST',
    params,
  });
}
