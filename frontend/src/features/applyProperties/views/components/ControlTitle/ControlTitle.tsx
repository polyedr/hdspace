import React, { memo } from 'react';

const styles = require('./ControlTitle.scss');

type Props = {
  content: string;
};

const ControlTitle: React.FC<Props> = memo((props) => {
  return (
    <h4 className={styles['control-title']}>{props.content}</h4>
  );
});

export { ControlTitle };
