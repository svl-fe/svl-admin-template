import { request } from 'umi';
import type { IDetectPositions, TTransChannels } from './data';

const prefix = '/v1/domaindata';

/**
 * 获取扫描识别位置
 */
export async function queryDectPositions(): Promise<IDetectPositions[]> {
  return request(`${prefix}/action/getdetectpositions`, {
    method: 'POST',
  });
}

/**
 * 获取传输通道
 */
export async function queryTransChannels(): Promise<TTransChannels[]> {
  return request(`${prefix}/action/gettransmissionchannels`, {
    method: 'POST',
  });
}
