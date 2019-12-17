import React, { memo, useCallback } from 'react';
import { T as ProjectT } from '$redux/project';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { IRightPanelProps } from '$components/RightPanel/MainPanel/';

const styles = require('./NavigateItem.scss');

interface INavigateItemProps {
  activeItem: ProjectT.ActiveItem,
  addContainer: IRightPanelProps['addContainer'],

}
export const NavigateItem: React.FunctionComponent<INavigateItemProps> = memo(({
  activeItem,
  addContainer,
}) => {
  const handleShowNav = useCallback(() => {
    addContainer(activeItem.itemId);
  }, [activeItem, addContainer]);
  return (
    <div className={styles.wrapper}>
      <Button
        onClick={handleShowNav}
      >
        <Icon icon="put-in" />
      </Button>
    </div>
  );
});
