import React from 'react';
import { useSelector } from 'react-redux';
import { Popover, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import cn from 'classnames';
import { selectElementById } from '../../../../redux/project/selectors';
import { SAVEABLE_ELEMENTS } from '../../../../constants/defaultParams';

const styles = require('./SaveElementAction.scss');

type Props = {
  elementId: string;
};

const SaveElementAction: React.FC<Props> = ({ elementId }) => {
  const element = useSelector(selectElementById(elementId));

  const inputRef = React.createRef<HTMLInputElement>();

  if (!element || !SAVEABLE_ELEMENTS.includes(element.type)) {
    return null;
  }

  return (
    <PopupState variant="popover" popupId={`${element.id}-save-popup`}>
      {(popupState) => (
        <div>
          <IconButton
            size="small"
            disableRipple
            edge={false}
            style={{ margin: 0, padding: 0 }}
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
                placeholder="Enter section name"
                onKeyPress={(event: React.SyntheticEvent) => {
                  const e: KeyboardEvent = event.nativeEvent as KeyboardEvent;
                  if (e.code === 'Enter') {
                    // Enter pressed
                    // const name = inputRef;
                    // .current!.value.toLowerCase()
                    // .replace(/ /g, '_');
                    inputRef.current!.value = '';
                    popupState.close();
                    // TODO: implement saving on the server side
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
