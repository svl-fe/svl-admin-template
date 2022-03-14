import type { FC } from 'react';
import { useMemo } from 'react';
import { Area } from '@ant-design/charts';

import styles from './Area.less';

interface IArea {
  baseCfg: any;
  dataCfg: any;
  hasMinute: boolean;
  customContent: Function;
}

const AreaChart: FC<IArea> = (props) => {
  const { baseCfg, dataCfg, hasMinute, customContent } = props;

  const metaCfg = useMemo(() => {
    baseCfg.tooltip.customContent = customContent(styles, hasMinute);
    return dataCfg.xField
      ? {
          meta: {
            [dataCfg.xField]: {
              formatter: (value: string) => {
                if (!hasMinute) {
                  return value;
                }
                const values = value.split('-');
                return values[values.length - 1];
              },
            },
          },
        }
      : {};
  }, [hasMinute, dataCfg]);

  return <Area {...baseCfg} {...dataCfg} {...metaCfg} />;
};

export default AreaChart;
