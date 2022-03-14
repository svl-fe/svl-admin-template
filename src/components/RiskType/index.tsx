import type { FC, MouseEventHandler } from 'react';
import MyIcon from '@/components/Icon';
import styles from './index.less';

interface IRiskTypeProps {
  level: number | string;
  onClick?: MouseEventHandler<HTMLSpanElement> | undefined;
  hover?: boolean;
}

export const RiskWarnings = {
  1: {
    icon: 'icon-dengji-jinji',
    text: '紧急',
    color: '#DB504A',
    background: 'rgba(219, 80, 74, 0.1)',
    level: 1,
  },
  2: {
    icon: 'icon-dengji-gao',
    text: '高',
    color: '#F4A261',
    background: 'rgba(244, 162, 97, 0.1)',
    level: 2,
  },
  3: {
    icon: 'icon-dengji-zhong',
    text: '中',
    color: '#FFC759',
    background: 'rgba(255, 199, 89, 0.1)',
    level: 3,
  },
  4: {
    icon: 'icon-dengji-di',
    text: '低',
    color: '#2A9D8F',
    background: 'rgba(42, 157, 143, 0.1)',
    level: 4,
  },
};

const RiskType: FC<IRiskTypeProps> = (props) => {
  const { level, onClick, hover = false } = props;

  return (
    <span
      onClick={onClick}
      className={`${styles.levelTag} ${styles['level' + level]} ${hover ? styles.hover : ''}`}
      style={{
        color: RiskWarnings[level].color,
        // background: RiskWarnings[level].background,
      }}
    >
      <MyIcon type={RiskWarnings[level].icon} style={{ marginRight: '4px' }} />
      {RiskWarnings[level].text}
    </span>
  );
};

export default RiskType;
