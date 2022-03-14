import { request } from 'umi';
import type { DataModel, OptionResult, RiskParams, Option } from './data';

/**
 * 获取后台模板枚举类型
 */
export async function queryTotalData(): Promise<Option> {
  return request(`/v1/statistic/device_status`, {
    method: 'POST',
  });
}

/**
 * 获取后台模板枚举类型
 */
export async function queryOptionsList(): Promise<OptionResult> {
  return request(`/v1/domaindata/action/getall`, {
    method: 'POST',
  });
}

/**
 * 获取风险等级提示数据
 */
export async function queryRiskLevelData(params: RiskParams): Promise<DataModel> {
  const { search, ...rest } = params;
  return request(`/v1/statistic/riskwarning/risklevelbytime`, {
    method: 'POST',
    params: { search },
    data: rest,
  });
}

/**
 * 获取风险渠道提示数据
 */
export async function queryRiskChannelData(params: RiskParams): Promise<DataModel> {
  return request(`/v1/statistic/riskwarning/risklevelbychannel`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取风险渠道提示数据top10
 */
export async function queryRiskChannelTop10(params: RiskParams): Promise<DataModel> {
  return request(`/v1/statistic/riskwarning/channel`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 文件传输数据（按时间）
 */
export async function queryRiskFile(params: RiskParams): Promise<DataModel> {
  const { search, ...rest } = params;
  return request(`/v1/statistic/userbehavior/outgoingfilebytime`, {
    method: 'POST',
    params: { search },
    data: rest,
  });
}

/**
 * 文件传输数据（按文件名）
 */
export async function queryRiskFileTop(params: RiskParams): Promise<DataModel> {
  return request(`/v1/statistic/userbehavior/outgoingfilebyname`, {
    method: 'POST',
    data: params,
  });
}
