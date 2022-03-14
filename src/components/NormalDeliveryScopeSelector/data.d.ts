export interface IEquipment extends ITableItem {
  uid: string;
  name: string;
  code: string;
  machine_id: string;
  status: string;
  code: string;
  is_installed: boolean;
  category: string;
}
export interface ITypeTreeParams extends ITableItem {
  scope: string;
  rule_id?: string;
}
