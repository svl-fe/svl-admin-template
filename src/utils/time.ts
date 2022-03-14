import moment from 'moment';

export const getRageTime = (
  day: number,
  format = 'YYYY-MM-DD HH:mm:ss',
  startKey = 'begin',
  endKey = 'end',
) => {
  return {
    [startKey]: moment().subtract(day, 'days').format(format),
    [endKey]: moment().format(format),
  };
};

export const getEnd = (begin: string, mon = 1, format = 'YYYY-MM') =>
  moment(begin).add(mon, 'months').format(format);
