/**
 * 处理树形结构相关的方法
 */
import _ from 'lodash';

export interface ITreeDataItem {
  key: string;
  title: string;
}

export interface ITreeData extends ITreeDataItem {
  children?: ITreeDataItem[];
}

/**
 * 根据指定字段进行树结构数据的转换
 *
 * @param data 原始树结构数据(只支持数组和对象)
 * @param {object} keyMap 键值映射
 * @param {string} children 树结构数据的子集字段名称
 * @returns
 */
function convertTreeBy<T>(data: T[] | T, keyMap: Record<string, string>, children = 'children') {
  const _data = _.clone(data);

  const recursiveFn = (item: T) => {
    const values = Object.keys(keyMap).reduce((prev, current) => {
      prev[keyMap[current]] = item[current];

      delete item[current];
      return prev;
    }, {});

    if (item[children]) {
      item[children] = convertTreeBy(item[children], keyMap);
    }

    return { ...values, ...item };
  };

  if (_data instanceof Array) {
    return _data.map(recursiveFn);
  }

  if (Object.prototype.toString.call(_data) === '[Object Object]') {
    return recursiveFn(_data);
  }

  return _data;
}

/**
 * 借助原始树结构数据，将数组转换成嵌套对象
 *
 * @param dataList
 * @param orgData
 * @returns
 *
 * 示例：
 *
 *                                      {
 *                                        "communication": ["feishu", "dingding"],
 *  ['feishu', "dingding", 'baidu'] =>    "cloud": ["baidu"],
 *                                      }
 */
function arrayToNestObjByTree(dataList: string[], treeData: ITreeData[]) {
  const obj = {};

  treeData.map((treeItem) => {
    const key = treeItem.key;

    obj[key] = [];
    if (treeItem?.children) {
      _.map(treeItem.children, (item) => {
        if (dataList.includes(item.key)) {
          obj[key].push(item.key);
        }
      });
    }
  });

  return obj;
}

export interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

/**
 * 根据指定字段将树形数据拍平成一级数组
 *
 * @param treeData
 * @param keyMap 键值映射
 * @returns
 */
const flattenTreeArrayBy = (treeData: TreeNode[], keyMap: Record<string, string>) => {
  let new_array: Record<string, string>[] = [];

  treeData.map((treeItem) => {
    const array_item = {};

    Object.keys(keyMap).map((key) => {
      array_item[key] = treeItem[keyMap[key]];
    });
    new_array.push(array_item);

    if (treeItem.children) {
      new_array = [...new_array, ...flattenTreeArrayBy(treeItem.children, keyMap)];
    }
  });

  return new_array;
};

/**
 * 根据指定字段将树形数据的二级结构数据拍平成一级数组
 *
 * @param treeData
 * @param keyMap 键值映射
 * @returns
 */
const flattenTreeArrayWithSecondary = (treeData: TreeNode[], keyMap: Record<string, string>) => {
  let new_array: Record<string, string>[] = [];

  treeData.map((parentItem) => {
    if (parentItem.children) {
      new_array = [...new_array, ...flattenTreeArrayBy(parentItem.children, keyMap)];
    }
  });

  return new_array;
};

export { convertTreeBy, arrayToNestObjByTree, flattenTreeArrayBy, flattenTreeArrayWithSecondary };
