import { request } from 'umi';
import type {
  IRiskRuleCreateParams,
  IRiskRuleDetail,
  IRiskRuleUpdateParams,
  IRiskRuleStatusChangeParams,
} from './data';
import type { ITableResult, ITableQuery } from '@/common';
import type {
  IConditionDetail,
  IFileRule,
  IUpdateRule,
  IUpdateUseScope,
} from '@/pages/strategy-center/data-identify/data';

const prefix = '/v1/behaviorrule';
const singlePrefix = '/v1';
/**
 * 获取风险规则列表
 */
export async function queryRiskRuleList(
  params: ITableQuery,
): Promise<ITableResult<IRiskRuleDetail>> {
  return request(`${prefix}/list`, {
    method: 'POST',
    params,
  });
}

/**
 * 创建新的风险规则
 */
export async function createRiskRule(data: IRiskRuleCreateParams): Promise<IRiskRuleDetail> {
  return request(`${prefix}`, {
    method: 'POST',
    data,
  });
}

/**
 * 更新风险规则
 */
export async function updateRiskRule({
  id,
  ...data
}: IRiskRuleUpdateParams): Promise<IRiskRuleDetail> {
  return request(`${prefix}/${id}`, {
    method: 'POST',
    data,
  });
}

/**
 * 删除风险规则
 */
export async function deleteRiskRule(id: string): Promise<any> {
  return request(`${prefix}/${id}/action/remove`, {
    method: 'POST',
  });
}

/**
 * 获取风险规则详情
 */
export async function queryRiskRuleDetail(id: string): Promise<IRiskRuleDetail> {
  return request(`${prefix}/${id}/detail`, {
    method: 'POST',
  });
}

/**
 * 启用或禁用风险规则状态
 */
export async function updateRiskRuleStatus({
  id,
  params,
}: IRiskRuleStatusChangeParams): Promise<IRiskRuleDetail> {
  return request(`${prefix}/${id}/action`, {
    method: 'POST',
    params,
  });
}

/**
 * 获取数据识别条件列表
 */
export async function queryIdentifyCondList(
  params: ITableQuery,
): Promise<ITableResult<IConditionDetail>> {
  return request(`${singlePrefix}/condition/list`, {
    method: 'POST',
    params,
  });
}
/**
 * 获取文件规则列表
 */
export async function getFileRuleList(params: ITableQuery): Promise<ITableResult<IFileRule>> {
  return request(`${prefix}/filerule/list`, {
    method: 'POST',
    params,
  });
}
/**
 * 更新规则
 */
export async function updateRule(params: IUpdateRule) {
  return request(`${prefix}/${params.id}`, {
    method: 'POST',
    data: params.params,
  });
}
/**
 * 应用范围修改
 */
export async function editUseScope(params: IUpdateUseScope) {
  return request(`${prefix}/${params.id}/scope/modify`, {
    method: 'POST',
    data: params.body,
  });
}
