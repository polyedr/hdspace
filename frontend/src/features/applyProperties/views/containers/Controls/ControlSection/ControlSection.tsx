import React, { memo } from 'react';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
const styles = require('./ControlSection.scss');

type Props = {
  title: string;
  children?: React.ReactNode;
};

const ControlSection: React.FC<Props> = memo((props) => {
  const { title, children } = props;

  return (
    <>
      <section className={styles.container}>
        <header className={styles.header}>
          <ControlTitle content={title} />
        </header>
        {children}
      </section>
    </>
  );
});

export { ControlSection };
