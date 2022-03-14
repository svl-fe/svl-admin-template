import React from 'react';
import { getLengthByUnicode } from '@/utils/chart';
import { Tooltip } from 'antd';

import styles from './index.less';

type FileRankItem = {
  name: string;
  type: string;
  count: number;
};

interface FileRankProps {
  /**类名 */
  className?: string;
  /**样式 */
  style?: React.CSSProperties;
  /**组建占据宽度 */
  width?: number;
  /**需展示的数据信息 */
  data: FileRankItem[];
}

export const FileRank: React.FC<FileRankProps> = (props) => {
  const { children, className, style, data, width = 0 } = props;

  return (
    <div className={`${className} ${styles.container}`} style={style}>
      {data.map((item, index) => {
        let tooltip = '';
        const { name, type = '', count } = item;
        let nameResult = type ? name + '.' + type : name;
        const nameWidth = width - (count + type).length * 8 - 40;
        if (nameWidth > 0) {
          const size = Math.floor(nameWidth / 8);
          const { data: newName, dot } = getLengthByUnicode({ text: name, size, unit: 1.5 });
          if (dot) {
            tooltip = nameResult;
          }
          nameResult = dot ? `${newName}${type}` : type ? `${newName}.${type}` : newName;
        }
        const nameDom = <div className={styles.name}>{nameResult}</div>;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.fileItem} key={name + index}>
            <div className={styles.index}>{index + 1}</div>
            {tooltip ? <Tooltip title={tooltip}>{nameDom}</Tooltip> : nameDom}
            <div className={styles.times}>{count}次</div>
          </div>
        );
      })}
      {children}
    </div>
  );
};

export default FileRank;

export type { FileRankProps, FileRankItem };
