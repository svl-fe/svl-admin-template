import React from 'react';
import logo from '@/asserts/logo.png';
import logoSmall from '@/asserts/logoSmall.png';
import RightContent from '@/components/RightContent';

import styles from './index.less';

type IProps = {
  collapsed?: boolean;
};

const GlobalHeader: React.FC<IProps> = ({ collapsed }) => {
  return (
    <div className={`${styles.header} ${collapsed ? styles.collpased : ''}`}>
      <img src={collapsed ? logoSmall : logo} />
      <RightContent />
    </div>
  );
};

export default GlobalHeader;
