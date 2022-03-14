import type { ITableItem } from '@/common';

/**
 * 系统管理员单项
 */
export interface ISystemAdmin extends ITableItem {
  uid: string; // 管理员id
  username: string; // 管理员账号
  name: string; // 管理员用户名
  password: string; // 管理员密码
  role: string; // 管理员角色
  created_time: string; // 创建时间
  updated_time: string; // 更新时间
  last_login: string; // 最近登陆
}

/**
 * 创建管理员
 */
export interface ICreateSystemAdmin {
  username: string;
  /** 管理员用户名 */
  name: string;
  /** 管理员密码  */
  password: string;
  role: string;
}

export interface ICreateSystemAdminForm extends ICreateSystemAdmin {
  /** 确认密码 */
  confirm: string;
}

/**
 * 更新管理员参数
 */
export interface IUpdateSystemAdmin {
  id: string;
  data: ICreateSystemAdmin;
}
