import React from 'react';

const styles = require('./ControlSection.scss');

type Props = {
  title: string;
  children: React.ReactElement;
};

const ControlSection = (props: Props) => {
  const { title } = props;

  return (
    <div className={styles.section}>
      <p className={styles.title}>{title}</p>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export { ControlSection };
