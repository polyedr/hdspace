import React, { memo } from 'react';

const styles = require('./ControlTitle.scss');

type Props = {
  content: string;
};

const ControlTitle: React.FC<Props> = memo(({ content }) => {
  return <h4 className={styles['control-title']}>{content}</h4>;
});

export { ControlTitle };
