import React from 'react';

const styles = require('./ControlSection.scss');

type Props = {
  title: string;
  children: React.ReactElement;
};

const ControlSection: React.FC<Props> = ({ title, children }) => (
  <div className={styles.section}>
    <p className={styles.title}>{title}</p>
    <div className={styles.content}>{children}</div>
  </div>
);

export default ControlSection;
