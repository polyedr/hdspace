import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import cn from 'classnames';

import { BorderedItem } from '../Border';

import { saveElementToLibrary } from '../../../../redux/project/actions';
import { LibraryElement, SectionServerElement } from '../../../../api/types';
import { Entity } from '../../../../domain/core';
import { selectActiveElement } from '../../../../redux/project/selectors';

const styles = require('./SaveElementAction.scss');

type SaveElementAction = {
  item: BorderedItem;
};

const SaveElementAction: React.FC<SaveElementAction> = ({ item }) => {
  const activeElement = useSelector(selectActiveElement);
  const inputRef = React.createRef<HTMLInputElement>();
  const dispatch = useDispatch();

  const convertElementToSection = (
    activeElement: LibraryElement<Entity, LibraryElement<Entity>[]>,
  ): SectionServerElement => {
    const {
      name,
      type,
      buoyancy,
      image,
      styles,
      parameters,
      children,
    } = activeElement;
    return {
      name,
      buoyancy,
      image,
      func_type: type,
      struct_type: type,
      styles,
      parameters: {
        ...parameters,
        group: 'custom',
      },
      children: children.map((child) => convertElementToSection(child)),
    } as SectionServerElement;
  };

  return (
    <PopupState variant="popover" popupId={`${item.id}-save-popup`}>
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
                    const name = inputRef
                      .current!.value.toLowerCase()
                      .replace(/ /g, '_');
                    inputRef.current!.value = '';
                    popupState.close();
                    const newLibraryElement = convertElementToSection(
                      activeElement,
                    );
                    newLibraryElement.name = name;
                    dispatch(saveElementToLibrary(item.id, newLibraryElement));
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
