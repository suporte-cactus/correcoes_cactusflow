import React from 'react';
import styles from './Tooltip.module.css';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => (
  <span className={styles.tooltip}>
    {children}
    <span className={styles.tooltipText}>{text}</span>
  </span>
);
