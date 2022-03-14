export const PASSWORD_REG =
  // /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z_!@#$%^&*`~()\-+=?/.]+$)(?![a-z0-9]+$)(?![a-z_!@#$%^&*`~()\-+=?/.]+$)(?![0-9_!@#$%^&*`~()\-+=?/.]+$)[a-zA-Z0-9_!@#$%^&*`~()\-+=?/.]{8,16}/;
  /**
   * 密码需包含大小写字母、特殊字符、数字中的三种，长度不得少于8位，且不能超过16位
   * 其中特殊字符位英文键盘对应的unicode码
   * */
  /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\x21-\x2f\x3a-\x40\x5b-\x60\x79-\x7E]+$)(?![a-z0-9]+$)(?![a-z\x21-\x2f\x3a-\x40\x5b-\x60\x79-\x7E]+$)(?![0-9\x21-\x2f\x3a-\x40\x5b-\x60\x79-\x7E]+$)[\x21-\x7E]{8,16}$/;

/**
 * 用户名不能中文，首字母不能是数字，最少3位
 */
export const NAME_REG = /^[A-Za-z_][A-Za-z0-9_]{2,}$/;
/**
 *
 *
 * @param {string} str 待检查的字符
 * @param {array} excludeStrList 需排除的特殊字符
 * @returns {boolean}
 */
// export const checkSpecialChars = (str: string, excludeStrList: string[] = []) => {
//   if (typeof str !== 'string') return true;
//   if (!(excludeStrList instanceof Array)) return true;

//   const specChars =
//     "[`~!@#$%^&*()_\\-+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？·「」『』]";

//   const regEx = excludeStrList.reduce((prev, curr) => {
//     return prev.replace(curr, '');
//   }, specChars);

//   return new RegExp(regEx).test(str);
// };

/**
 * 检查字符中是否包含特殊字符(除中文、英文、数字)
 * @param {string} str 待检查字符
 * @returns
 */
export const checkSpecialChars = (str: string, excludesStrList: string[] = []) => {
  let regEx = '^[0-9a-zA-Z\u4e00-\u9fa5]+$';
  if (excludesStrList.length !== 0) {
    regEx = '^[0-9a-zA-Z\u4e00-\u9fa5' + excludesStrList.join('') + ']+$';
  }

  return !new RegExp(regEx).test(str);
};

export const checkNumber = (str: string) => {
  return new RegExp('[0-9]').test(str);
};

/** 检查小写字母 */
export const checkLowercase = (str: string) => {
  return new RegExp('[a-z]').test(str);
};

/** 检车大写字母 */
export const checkUppercase = (str: string) => {
  return new RegExp('[A-Z]').test(str);
};

export const checkDiffChars = (
  str: string,
  { min, options = 'all' }: { min: number; options?: string | string[] },
) => {
  let sum = 0;
  let types = options;
  let length = min;

  if (types === 'all') {
    types = ['number', 'lower', 'upper', 'special'];
  }

  if (!length) length = types.length;
  // @ts-ignore
  types.map((type) => {
    switch (type) {
      case 'number':
        if (checkNumber(str)) sum += 1;
        break;
      case 'lower':
        if (checkLowercase(str)) sum += 1;
        break;
      case 'upper':
        if (checkUppercase(str)) sum += 1;
      case 'special':
        if (checkSpecialChars(str)) sum += 1;
        break;
      default:
        break;
    }
  });

  if (options === 'all' && sum >= length) return true;
  if (options !== 'all' && sum === types.length) return true;

  return false;
};
