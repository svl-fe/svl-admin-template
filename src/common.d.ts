/**
 * 列表增删改查状态
 */
export type ITableStatus = 'list' | 'create' | 'edit' | 'delete' | 'query';

/**
 * 列表查询
 */
export interface ITableQuery {
  /** 当前页数 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 搜索字段 模糊匹配 */
  search?: string;
  /** 搜索字段 精准匹配 */
  keywords?: Record<string, string[]>;
}

/**
 * 列表结果
 */
export interface ITableResult<T> {
  total: number;
  page: number;
  results: T[];
}

export interface ITableItem {
  /** 序列号 */
  __serial_num: number;
}

export interface ITreeDataItem {
  key: string;
  title: string;
}

export interface ITreeData extends ITreeDataItem {
  children?: ITreeDataItem[];
}

export type Option = { key?: string; label: string; value: string };
export type MapOptions = Record<string, Option[]>;
