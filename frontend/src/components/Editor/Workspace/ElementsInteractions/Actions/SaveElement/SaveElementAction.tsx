import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { Popover, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import cn from 'classnames';
import { SAVEABLE_ELEMENTS } from '@Constants/defaultParams';
import { updateElement } from '@Redux/project/actions';
import { makeStyles } from '@mui/styles';
import { StateElement } from '@Src/types';
import { useButtonStyles } from '../hooks/styles';

interface Props {
  element: StateElement;
}

const useStyles = makeStyles({
  content: {
    display: 'block',
    backgroundColor: '#2f4050',
  },
  name: {
    margin: '5px',
  },
});

const SaveElementAction: React.FC<Props> = ({ element }) => {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();
  const dispatch = useDispatch();

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
            className={buttonClasses.iconButton}
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
            TransitionProps={{
              onEntered: () => inputRef.current.focus(),
            }}
          >
            <div className={cn(classes.content)}>
              <input
                ref={inputRef}
                type="text"
                className={classes.name}
                placeholder="Enter section name"
                onKeyPress={(event: React.KeyboardEvent) => {
                  if (event.key === 'Enter') {
                    // Enter pressed
                    const name = inputRef.current.value;
                    inputRef.current.value = '';
                    popupState.close();
                    dispatch(
                      updateElement<'section'>({
                        elementID: element.id,
                        data: {
                          name,
                          shared: true,
                        },
                        active: true,
                      }),
                    );
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

export default memo(SaveElementAction);
