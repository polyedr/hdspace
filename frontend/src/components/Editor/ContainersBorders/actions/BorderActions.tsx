import React from 'react';
import cn from 'classnames';

import { Button, Icon } from '../../../UI';
import { BorderedItem } from '../Border';

const styles = require('./BorderActions.scss');

export type BorderActionProps = {
  icon: string;
  item: BorderedItem;
  style?: string;
  disabled?: boolean;
  onClick: (event: React.SyntheticEvent) => void;
};

const BorderAction: React.FC<BorderActionProps> = ({
  icon,
  item,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={cn(styles.actions)}
      style={{ top: item.borderDom.coordinates.top }}
    >
      <Button
        styleType="none"
        className={cn(styles.actionButton)}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon icon={icon} />
      </Button>
    </div>
  );
};

export default BorderAction;
