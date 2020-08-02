import React, { memo } from 'react';

import { RemoveStyles } from '../../containers/RemoveStyles/RemoveStyles';
import { ControlTitle } from '../ControlTitle/ControlTitle';

const styles = require('./StylesHeader.scss');

type Props = {
  title: string;
  cssPropertiesNames: string[];
  onClick(cssPropertiesNames: string[]): void;
};

const StylesHeader = memo((props: Props) => {
  const { title, ...restProps } = props;

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <ControlTitle content={title} />
      </div>
      <RemoveStyles {...restProps} />
    </header>
  );
});

export { StylesHeader };
