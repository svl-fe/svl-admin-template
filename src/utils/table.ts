/**
 * 处理关于表格相关的方法
 */

export const defaultRender = (text: any) => text || '-';

interface IPagination {
  /** 当前页数 */
  page: number;
  /** 每页条数 */
  limit: number;
}

export const DFT_PAGE_OPTION = {
  page: 1,
  limit: 10,
};

/**
 * 给表格数据增加序号
 */
function addSerialNumber<T>(data: T[], params: IPagination) {
  const { page, limit } = params;
  const _data: T[] = [];

  if (page < 1) {
    throw new Error('当前页数不能小于1');
  }

  data.map((item, index) => {
    _data.push({
      ...item,
      __serial_num: (page - 1) * limit + index + 1,
    });

    return item;
  });

  return _data;
}

export { addSerialNumber };
