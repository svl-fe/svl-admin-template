import type { DataModel, Option } from '@/pages/data-view/data';

/**
 * 解析多层数据为单层数据,并替换其中的枚举值
 * expamle：
 * 转换[{
    "name": "risk_level",
    "value": 1,
    "count": 11,
    "buckets": [
        {
            "name": "channel",
            "value": "feishu",
            "count": 9
        },
        {
            "name": "channel",
            "value": "wetchat_enterprise",
            "count": 2
        }
    ]
    }]
    为 
    [
        {risk_level: '中', channel: '飞书', count: 9},
        {risk_level: '中', channel: '微信', count: 2},
    ]
 * @param originData DataModel
 * @param optionsObj Option
 * @param optionsSecondObj Option
 * @returns 
 */
export const flatenData = (
  originData: DataModel,
  optionsObj?: Option,
  optionsSecondObj?: Option,
) => {
  const result: Option[] = [];
  let xField = '';
  let seriesField = '';
  for (let index = 0, len = originData.length; index < len; index++) {
    const { name, value, count, buckets } = originData[index];
    if (buckets && optionsSecondObj) {
      const { data, xField: childX } = flatenData(buckets, optionsSecondObj);
      seriesField = name;
      xField = childX;
      const newData = data.map((item) => ({
        ...item,
        [name + '_origin']: value,
        [name]: optionsObj ? optionsObj[value] ?? value : value,
      }));
      result.push(...newData);
    } else {
      xField = name;
      const item = {
        [name]: optionsObj ? optionsObj[value] ?? value : value,
        count,
      };
      result.push(item);
    }
  }

  return {
    data: result,
    xField,
    yField: 'count',
    seriesField,
  };
};

export const resolveOptions2Obj = (
  options: any[],
  key = 'name',
  value = 'display_name',
  handelValue?: any,
) => {
  let result = {};
  options.forEach((option) => {
    result[option[key]] = handelValue ? handelValue(option[value]) : option[value];
    if (option.children) {
      const childResult = resolveOptions2Obj(option.children, key, value, handelValue);
      result = { ...result, ...childResult };
    }
  });
  return result;
};

export const formatNum = (num: number) => {
  if (num > 1e6) {
    return (num / 1e6).toFixed(1) + 'M+';
  } else if (num > 1e3) {
    return Math.floor(num / 1e3) + 'K+';
  }
  return num + '';
};

export const getLengthByUnicode = ({
  text,
  size,
  unit,
}: {
  text: string;
  size: number;
  unit: number;
}) => {
  let totalCount = 0;
  let newStr = '';
  for (let i = 0, len = text.length; i < len; i++) {
    const c = text.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      totalCount++;
    } else {
      totalCount += unit;
    }
    if (totalCount < size) {
      newStr = text.substring(0, i + 1);
    } else {
      return { data: newStr + '...', dot: true };
    }
  }
  return { data: newStr, dot: false };
};

export const getSuitWidth = ({
  clientWidth,
  space,
  initNumber,
  initWidth,
  minWidth,
  maxWidth,
}: any) => {
  let widthN = Math.floor((clientWidth - space * (initNumber - 1)) / initNumber);
  if (widthN < minWidth) {
    if (initNumber > 3) {
      widthN = getSuitWidth({
        clientWidth,
        space,
        initNumber: initNumber - 1,
        initWidth,
        minWidth,
        maxWidth,
      });
    } else {
      widthN = minWidth;
    }
  } else if (widthN > maxWidth) {
    widthN = getSuitWidth({
      clientWidth,
      space,
      initNumber: initNumber + 1,
      initWidth,
      minWidth,
      maxWidth,
    });
  } else if (widthN >= minWidth && widthN <= maxWidth) {
    widthN = widthN;
  } else {
    widthN = initWidth;
  }
  return widthN;
};

export const getIdObject = (children: any[], ids = {}, total = 0) => {
  let totalR = total;
  children.forEach((item) => {
    const { data, children: child } = item;
    if (!child) {
      const { uid } = data || {};
      totalR++;
      if (uid) {
        if (ids[uid]) {
          ids[uid]++;
        } else {
          ids[uid] = 1;
        }
      }
    } else {
      const { total: totalC } = getIdObject(child, ids, totalR);
      totalR = totalC;
    }
  });
  return { ids, total: totalR };
};

export const checkEmpty = (children: any[]) => {
  let result = false;
  children.forEach((item) => {
    const { data, children: child } = item;
    if (!child) {
      const { uid, threshold = {} } = data || {};
      const { name, params = {} } = threshold;
      const { gte } = params;
      if (!(uid && name && gte)) {
        result = true;
        return;
      }
    } else {
      result = checkEmpty(child);
      if (result) {
        return;
      }
    }
  });
  return result;
};

export function changeByte(limit: number) {
  let size = '';
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B';
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  return size.replace('.00', '');
}

/**
 * 获取要展示字符串数量
 * @param strings
 * @param maxLen
 * @returns {index: number, flag: boolean}
 */
export function getShowString(strings: string[], maxLen: number): { index: number; flag: boolean } {
  let result = 1;
  const len = strings.length;
  let current = 0;
  for (let index = 0; index < len; index++) {
    const element = strings[index];
    current += element?.length || 0;
    if (current > maxLen) {
      break;
    }
    result = index + 1;
    current += 1;
  }
  return {
    index: result,
    flag: result >= len,
  };
}
