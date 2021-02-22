import React, { useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import StylesHeader from '../../helperComponents/StylesHeader';
import FlexProperties from '../../helperComponents/Display/FlexProperties';
import { DISPLAY } from './constants';
import PlaceItemsProperties from '../../helperComponents/Display/PlaceItemsProperties';
import { StyledTextField } from '../../../../styledComponents';

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
}) => {
  const handleDisplayDropdownChange = useCallback(
    (event) => {
      updateStyles({ display: event.target.value });
    },
    [updateStyles],
  );

  return (
    <>
      <div>
        {!masterScreenEnabled && (
          <StylesHeader
            title="Display"
            onClick={removeStyles}
            cssPropertiesNames={[
              'display',
              'justifyContent',
              'alignItems',
              'flexDirection',
            ]}
          />
        )}

        <StyledTextField
          fullWidth
          margin="dense"
          label="Display"
          value={display || 'initial'}
          onChange={handleDisplayDropdownChange}
          select
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
        />
      )}
      {!!display && ['grid', 'inline-grid'].includes(display) && (
        <PlaceItemsProperties
          reversed={false}
          justifyContent={justifyContent}
          alignItems={alignItems}
          updateStyles={updateStyles}
        />
      )}
    </>
  );
};

export default Display;
