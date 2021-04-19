import React, { useCallback, useRef } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Popover, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  selectCanCreateGroup,
  selectSelectedElementsIds,
} from '@Redux/project/selectors/element';
import { createElementsGroup } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

import { makeStyles } from '@material-ui/core/styles';
import { useButtonStyles } from '../hooks/styles';

type Props = {
  elementId: string;
};

const useStyles = makeStyles({
  content: {
    display: 'block',
    backgroundColor: '#2f4050',
  },
  name: {
    margin: '5px',
  },
});

const CreateGroupAction: React.FC<Props> = ({ elementId }) => {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();
  const canCreateGroup = useSelector(selectCanCreateGroup);
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const screenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const createGroup = useCallback(() => {
    if (!inputRef.current) {
      console.error('Group name input is not defined');
      return;
    }
    const name = inputRef.current.value;
    dispatch(
      createElementsGroup(name, selectedElementsIds, {
        screenId,
      }),
    );
  }, [dispatch, selectedElementsIds]);

  if (!canCreateGroup) {
    return null;
  }

  return (
    <PopupState variant="popover" popupId={`${elementId}-create-group-popup`}>
      {(popupState) => (
        <>
          <IconButton
            size="small"
            title="Create group"
            disableRipple
            edge={false}
            className={buttonClasses.iconButton}
            {...bindTrigger(popupState)}
          >
            <AddIcon fontSize="inherit" />
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
            <div className={cn(classes.content)}>
              <input
                ref={inputRef}
                type="text"
                className={classes.name}
                placeholder="Group name"
                onKeyPress={(event: React.KeyboardEvent) => {
                  if (event.key === 'Enter') {
                    popupState.close();
                    createGroup();
                  }
                }}
              />
            </div>
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export default CreateGroupAction;
