import React, { useCallback, useRef, memo } from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Popover, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createElementsGroup } from '@Redux/project/actions';
import logger from 'loglevel';

import { makeStyles } from '@mui/styles';
import { StateElement } from '@Src/types';
import { useButtonStyles } from '../hooks/styles';

type Props = {
  element: StateElement;
  canCreateGroup: boolean;
  selectedElementsIds: string[];
  screenId: number;
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

const CreateGroupAction: React.FC<Props> = ({
  element,
  screenId,
  selectedElementsIds,
  canCreateGroup,
}) => {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const createGroup = useCallback(() => {
    if (!inputRef.current) {
      logger.error('Group name input is not defined');
      return;
    }
    const name = inputRef.current.value;
    dispatch(
      createElementsGroup(name, selectedElementsIds, {
        screenId,
      }),
    );
  }, [dispatch, screenId, selectedElementsIds]);

  if (!canCreateGroup) {
    return null;
  }

  return (
    <PopupState variant="popover" popupId={`${element.id}-create-group-popup`}>
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
            TransitionProps={{
              onEntered: () => inputRef.current!.focus(),
            }}
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

export default memo(CreateGroupAction);
