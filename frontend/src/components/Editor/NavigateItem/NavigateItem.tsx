import React, { memo } from 'react';

import { useSelector } from 'react-redux';
import Button from '$components/UI/Button';
import Icon from '$components/UI/Icon';
import { selectors } from '$redux/project';

const styles = require('./NavigateItem.scss');

interface INavigateItemProps {
  onWrapIntoContainer(id: string): void;
}
const NavigateItem: React.FC<INavigateItemProps> = (props) => {
  const { onWrapIntoContainer } = props;

  const { itemId } = useSelector(selectors.selectActiveItem);

  const handleClick = () => {
    onWrapIntoContainer(itemId);
  };

  return (
    <div className={styles.wrapper}>
      <Button onClick={handleClick}>
        <Icon icon="put-in" />
      </Button>
    </div>
  );
};

export default memo(NavigateItem);
