import * as React from 'react';

import styles from './style/index.less';

type CardItem = {
  /**类名 */
  className?: string;
  key: string;
  /**样式 */
  style?: React.CSSProperties;
  /**图标父级类名 */
  iconContainerClassName?: string;
  /**图标父级样式 */
  iconContainerStyle?: React.CSSProperties;
  /**图标名称 */
  icon?: React.ReactNode;
  /**展示文案 */
  label: string;
  /**展示文案类名 */
  labelClassName?: string;
  /**展示文案样式 */
  labelStyle?: React.CSSProperties;
  /**数据值 */
  value: string | number;
  /**数据值类名 */
  valueClassName?: string;
  /**数据值样式 */
  valueStyle?: React.CSSProperties;
};

interface CardProps {
  /**类名 */
  className?: string;
  /**样式 */
  style?: React.CSSProperties;
  /**需展示的数据信息 */
  data: CardItem[];
}

export const Card: React.FC<CardProps> = (props) => {
  const { children, className, style, data } = props;

  return (
    <div className={`${styles['svl-card-container']} ${className}`} style={style}>
      {data.map((item) => {
        const {
          iconContainerClassName = '',
          iconContainerStyle,
          icon,
          label,
          labelClassName = '',
          labelStyle,
          value,
          valueClassName = '',
          valueStyle,
          className: classN = '',
          style: styleN,
        } = item;
        return (
          <div className={`${styles.cardItem} ${classN}`} style={styleN} key={label}>
            <div
              className={`${styles.iconContainer} ${iconContainerClassName}`}
              style={iconContainerStyle}
            >
              {icon}
            </div>
            <div>
              <div className={`${styles.label} ${labelClassName}`} style={labelStyle}>
                {label}
              </div>
              <div className={`${styles.value} ${valueClassName}`} style={valueStyle}>
                {value}
              </div>
            </div>
          </div>
        );
      })}
      {children}
    </div>
  );
};

export default Card;

export type { CardProps, CardItem };
