import React, { memo } from 'react';

import { Button } from '$components/UI/Button';

const styles = require('./RemoveStyles.scss');

type Props = {
  ruleNames: string[];
  onClick(ruleNames: string[]): void;
};

const RemoveStyles = memo((props: Props) => {
  const { onClick, ruleNames } = props;

  const handleButtonClick = () => {
    onClick(ruleNames);
  };

  return (
    <Button className={styles.button} styleType="grey" onClick={handleButtonClick}>Clear styles</Button>
  );
});

export { RemoveStyles };
