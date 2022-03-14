import type { ReactNode } from 'React';
import type { ITableItem } from '@/common';
import type { IConditionDetail } from '../data-identify/data';

/**
 * 条件种类
 */
export interface IRuleCategory {
  uid: string;
  name: string;
  display_name: string;
  optional_data: Record<string, string>;
}

/**
 * 风险规则状态
 */
type TRiskRuleStatus = 'activated' | 'deactivated' | 'deleted';

type TFormRiskRuleMap = 'threshold' | 'position' | 'channel';

/**
 * 风险规则状态变更操作
 */
export type TRiskRuleStatusActions = 'activate' | 'deactivate' | 'delete';

/**
 * 风险规则阈值
 */
export interface IRiskRuleThreshold {
  category: 'range';
  params: {
    /** 大于等于 */
    gte: number;
    /** 小于等于 */
    lte?: number;
  };
}

/**
 * 风险规则创建参数
 */
export interface IRiskRuleCreateParams {
  name: string; // 规则名称
  description: string; // 规则描述
  scope: 'global' | 'default'; // 规则应用
  risk_id: string; // 风险类型
  action: 'notify' | 'ignore'; // 响应动作
  condition_ids: string[]; // 条件ids列表
  relation: 'all' | 'any'; // 条件关系
  /** 条件阈值 */
  threshold: IRiskRuleThreshold;
  positions: string[]; // 扫描位置
  channels: string[]; // 传输渠道
}

/**
 * 风险规则更新参数
 */
export interface IRiskRuleUpdateParams extends IRiskRuleCreateParams {
  id: string;
}

/**
 * 创建风险规则表单值
 */
export interface IRiskRuleFormValues extends Omit<IRiskRuleCreateParams, TFormRiskRuleMap> {
  /** 条件阈值 */
  threshold: number;
  /** 扫描位置 */
  positions: Record<string, string[]>;
  /** 传输渠道 */
  channels: Record<string, string[]>;
}

/**
 * 单个风险规则详情
 */
export interface IRiskRuleDetail extends IRiskRuleCreateParams, ITableItem {
  uid: string;
  company_id: string;
  policy_id: string;
  source: 'default';
  status: TRiskRuleStatus;
  signature: string;
  risk_level: number;
  risk_name: string;
  created_time: string;
  updated_time: string;
  conditions: IConditionDetail[];
  file_rules?: { uid: string; name: string }[];
}

/**
 * 风险规则状态改变参数
 */
export interface IRiskRuleStatusChangeParams {
  id: string;
  params: {
    operation: TRiskRuleStatusActions;
  };
}

/**
 * 风险类型
 */
export interface IRiskCategory {
  uid: string;
  company_id: string;
  name: string;
  level: 1;
  created_time: string;
  updated_time: string;
  rule_count: number;
  is_used: boolean;
}

/**
 * 创建风险类型参数
 */
export interface IRiskCategoryCreateParams {
  name: string; // 风险类型名称
  level: string;
}

/**
 * 风险规则操作选项
 */
export type TRiskRuleStepActions = 'cancel' | 'next' | 'previous' | 'create' | 'close';

/**
 * 风险规则步骤条
 */
export interface IRiskRuleSteps {
  title?: string;
  content: ReactNode;
  actions: TRiskRuleStepActions[];
}

export interface IRiskRelation {
  key: string;
  name: content;
}

/**
 * 单个检测位置项
 */
interface IDetectPosition {
  name: string;
  display_name: string;
}

/**
 * 检测位置
 */
export interface IDetectPositions extends IDetectPosition {
  children: IDetectPosition[];
}

export type TTransChannels = IDetectPositions;
