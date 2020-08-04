import React, { memo } from 'react';

import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { useSelector } from 'react-redux';
import { selectors } from '$redux/project';

const styles = require('./NavigateItem.scss');

interface INavigateItemProps {
  onWrapIntoContainer(id: string): void;
}
export const NavigateItem: React.FunctionComponent<INavigateItemProps> = memo((props) => {
  const { onWrapIntoContainer } = props;

  const { itemId } = useSelector(selectors.selectActiveItem);

  const handleClick = () => {
    onWrapIntoContainer(itemId);
  };

  return (
    <div className={styles.wrapper}>
      <Button
        onClick={handleClick}
      >
        <Icon icon="put-in" />
      </Button>
    </div>
  );
});
