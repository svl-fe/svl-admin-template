import moment from 'moment';

export const TIME_FMT = 'YYYY-MM-DD HH:mm:ss';

interface ITimeOpt {
  name: string;
  value: [() => string, () => string];
}

// 传后端的开始时间加 :00:00, 结束时间加 :59:59
export const FORMAT = 'YYYY-MM-DD HH';

const common: Record<string, ITimeOpt> = {
  'last-2day': {
    name: '2天内',
    value: [
      () => moment().format('YYYY-MM-DD HH:mm:ss'),
      () => moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
    ],
  },
  'last-week': {
    name: '一周内',
    value: [
      () => moment().format('YYYY-MM-DD HH:mm:ss'),
      () => moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    ],
  },
  'last-month': {
    name: '一个月内',
    value: [
      () => moment().format('YYYY-MM-DD HH:mm:ss'),
      () => moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
    ],
  },
};
export const commonMonth: Record<string, ITimeOpt> = {
  'last-3month': {
    name: '三个月内',
    value: [
      () => moment().format('YYYY-MM-DD HH:mm:ss'),
      () => moment().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
    ],
  },
  'last-6month': {
    name: '六个月内',
    value: [
      () => moment().format('YYYY-MM-DD HH:mm:ss'),
      () => moment().subtract(6, 'months').format('YYYY-MM-DD HH:mm:ss'),
    ],
  },
};

export const TIME_OPTS: Record<string, ITimeOpt> = {
  'last-24hour': {
    name: '过去24小时',
    value: [
      () => moment().format('YYYY-MM-DD HH:mm:ss'),
      () => moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    ],
  },
  ...common,
};

export const DATE_OPTS: Record<string, ITimeOpt> = {
  ...common,
  ...commonMonth,
};
