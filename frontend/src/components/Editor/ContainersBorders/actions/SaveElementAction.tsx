import React from 'react';
// import { useDispatch } from 'react-redux';
import { Popover, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import cn from 'classnames';

import { BorderedItem } from '../Border';

const styles = require('./SaveElementAction.scss');

type SaveElementAction = {
  item: BorderedItem;
};

const SaveElementAction: React.FC<SaveElementAction> = ({ item }) => {
  // const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const inputRef = React.createRef<HTMLInputElement>();
  // const dispatch = useDispatch();
  return (
    <PopupState variant="popover" popupId={`${item.id}-save-popup`}>
      {(popupState) => (
        <div>
          <IconButton
            size="small"
            disableRipple
            edge={false}
            {...bindTrigger(popupState)}
          >
            <SaveIcon fontSize="inherit" />
          </IconButton>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onEntered={() => inputRef.current!.focus()}
          >
            <div className={cn(styles.popoverContent)}>
              <input
                ref={inputRef}
                type="text"
                className={styles.componentNameInput}
                placeholder="Enter component name"
                onKeyPress={(event: React.SyntheticEvent) => {
                  console.log('KEY PRESSED!', event);
                  const e: KeyboardEvent = event.nativeEvent as KeyboardEvent;
                  if (e.keyCode === 13) {
                    // Enter pressed
                    const componentName = inputRef.current!.value;
                    inputRef.current!.value = '';
                    console.log('SUCCESS!', componentName);
                  }
                }}
              />
            </div>
          </Popover>
        </div>
      )}
    </PopupState>
  );
};

export default SaveElementAction;
