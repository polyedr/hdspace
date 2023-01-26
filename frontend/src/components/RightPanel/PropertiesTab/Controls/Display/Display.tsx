import React, { useCallback } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { MenuItem } from '@mui/material';
import FlexProperties from '../../helperComponents/Display/FlexProperties';
import { DISPLAY } from './constants';
import PlaceItemsProperties from '../../helperComponents/Display/PlaceItemsProperties';
import { StyledTextField } from '../../../../styledComponents';
import RemoveStyles from '../../helperComponents/RemoveStyles';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  display?: React.CSSProperties['display'];
  flexDirection: React.CSSProperties['flexDirection'];
  justifyContent: React.CSSProperties['justifyContent'];
  alignItems: React.CSSProperties['alignItems'];
};

const Display: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  masterScreenEnabled,
  canEdit,
  element,
  editableStyles,
}) => {
  const handleDisplayDropdownChange = useCallback(
    (event) => {
      updateStyles({ display: event.target.value });
    },
    [updateStyles],
  );

  return (
    <div>
      <div>
        {!masterScreenEnabled && canEdit && (
          <RemoveStyles
            onClick={removeStyles}
            propsToRemove={[
              'display',
              'justifyContent',
              'alignItems',
              'flexDirection',
            ]}
            type={element.type}
            editableStyles={editableStyles}
          />
        )}

        <StyledTextField
          fullWidth
          margin="dense"
          value={display || 'initial'}
          onChange={handleDisplayDropdownChange}
          select
          disabled={!canEdit}
        >
          {DISPLAY.map(({ value, label }) => (
            <MenuItem key={value} value={value} dense>
              {label}
            </MenuItem>
          ))}
        </StyledTextField>
      </div>

      {display === 'flex' && (
        <FlexProperties
          flexDirection={flexDirection}
          justifyContent={justifyContent}
          alignItems={alignItems}
          updateStyles={updateStyles}
          canEdit={canEdit}
        />
      )}
      {!!display && ['grid', 'inline-grid'].includes(display) && (
        <PlaceItemsProperties
          reversed={false}
          justifyContent={justifyContent}
          alignItems={alignItems}
          updateStyles={updateStyles}
          canEdit={canEdit}
        />
      )}
    </div>
  );
};

export default Display;
