import { request } from 'umi';
import type { ICreateSystemAdmin, IUpdateSystemAdmin, ISystemAdmin } from './data';
import type { ITableResult, ITableQuery } from '@/common';

const prefix = '/v1/companyadmin';

/**
 * 获取数据系统管理员列表
 */
export async function querySysAdminList(params: ITableQuery): Promise<ITableResult<ISystemAdmin>> {
  return request(`${prefix}/list`, {
    method: 'POST',
    params,
  });
}

/**
 * 创建新的系统管理员
 */
export async function createSysAdmin(data: ICreateSystemAdmin): Promise<ISystemAdmin> {
  return request(`${prefix}`, {
    method: 'POST',
    data,
  });
}

/**
 * 更新系统管理员
 */
export async function updateSysAdmin({ id, data }: IUpdateSystemAdmin): Promise<ISystemAdmin> {
  return request(`${prefix}/${id}`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除系统管理员
 */
export async function deleteSysAdmin(id: string): Promise<any> {
  return request(`${prefix}/${id}/action/remove`, { method: 'POST' });
}
