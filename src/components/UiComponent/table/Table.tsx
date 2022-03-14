import { Table as ATable } from 'antd';
import classNames from 'classnames/bind';
import type {
  TableProps as ATableProps,
  TablePaginationConfig,
  ColumnProps as AColumnProps,
} from 'antd/lib/table';
import style from './index.less';

const cx = classNames.bind(style);

export interface TableProps<T> extends ATableProps<T> {
  /** 数据总数 */
  total?: number;
}

export type ColumnProps<T> = AColumnProps<T>;

export const Table = <T extends object = any>(props: TableProps<T>) => {
  const { className, bordered, total, pagination, scroll = { x: 1232 }, ...restProps } = props;
  let paginationCfg: TablePaginationConfig | false;
  const tableCls = cx({
    'svl-table': true,
    className,
  });

  // 默认分页配置项
  const defaultPagination: TablePaginationConfig = {
    total,
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
    showTotal: (data: number) => (
      <div>
        共<span className={style.svlTableTotal}>{data}</span>条
      </div>
    ),
    pageSize: 10,
    defaultCurrent: 1,
  };

  // 用户可能将 total 值放置在 pagination 中
  if (total || pagination) {
    if (pagination) {
      paginationCfg = { ...defaultPagination, ...pagination };
    } else {
      paginationCfg = defaultPagination;
    }
  } else {
    paginationCfg = false;
  }

  return (
    <ATable
      data-testid="test-table"
      bordered={bordered}
      className={tableCls}
      scroll={scroll}
      {...restProps}
      pagination={paginationCfg}
    />
  );
};

Table.defaultProps = {
  total: 0,
  borderd: true,
};

export default Table;
