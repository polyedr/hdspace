import React, { memo } from 'react';

import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';

const styles = require('./NavigateItem.scss');

interface INavigateItemProps {
  onWrapIntoContainer(): void;
}
export const NavigateItem: React.FunctionComponent<INavigateItemProps> = memo((props) => {
  const { onWrapIntoContainer } = props;

  return (
    <div className={styles.wrapper}>
      <Button
        onClick={onWrapIntoContainer}
      >
        <Icon icon="put-in" />
      </Button>
    </div>
  );
});
