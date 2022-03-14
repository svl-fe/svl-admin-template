import type { IRiskRelation } from '../data';

export const relations: IRiskRelation[] = [
  {
    key: 'all',
    name: '同时',
  },
  {
    key: 'any',
    name: '一个',
  },
];

export const RiskRuleTitles = {
  create: '新增规则',
  edit: '编辑规则',
  query: '规则详情',
};
