import React, { useState } from 'react';
import Popover from 'react-tiny-popover';
import cn from 'classnames';

import { BorderedItem } from '../Border';
import { Button, Icon } from '../../../UI';
import BorderAction from './BorderActions';

const styles = require('./SaveElementAction.scss');

const popoverStyle = {
  opacity: '1',
  overflow: 'visibility',
  zIndex: '20',
  border: '1px solid #e7eaec',
  borderRadius: '4px',
};

type SaveElementAction = {
  item: BorderedItem;
};

const SaveElementAction: React.FC<SaveElementAction> = ({ item }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [componentName, setComponentName] = useState<string>();
  return (
    <Popover
      isOpen={isPopoverOpen}
      position="right"
      onClickOutside={() => setIsPopoverOpen(!isPopoverOpen)}
      align="start"
      transitionDuration={0}
      containerStyle={popoverStyle}
      content={
        <div className={cn(styles.popoverContent)}>
          <input
            type="text"
            className={styles.screenName}
            value={componentName}
            placeholder="Enter component name"
            onChange={({ target: { value } }) => setComponentName(value)}
          />
          <Button
            styleType="none"
            onClick={() => {
              console.log('SAVE ACTION CLICKED!');
            }}
          >
            <Icon icon="save" />
          </Button>
        </div>
      }
    >
      <BorderAction
        item={item}
        icon="save"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      />
    </Popover>
  );
};

export default SaveElementAction;
