import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '@Redux/project/selectors/element';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import StylesHeader from '../../helperComponents/StylesHeader';
import FlexProperties from '../../helperComponents/Display/FlexProperties';
import { DISPLAY } from './constants';
import PlaceItemsProperties from '../../helperComponents/Display/PlaceItemsProperties';

type Props = PropertiesChangeProps<LibraryElement<Entity>>;

const Display: React.FC<Props> = ({ updateStyles, removeStyles }) => {
  const display = useSelector(selectCurrentEditableStyles('display'));

  const handleDisplayDropdownChange = useCallback(
    (event) => {
      updateStyles({ display: event.target.value });
    },
    [updateStyles],
  );

  return (
    <>
      <div>
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

        <FormControl fullWidth margin="dense">
          <InputLabel>Display</InputLabel>

          <Select
            margin="dense"
            label="Display"
            value={display || 'initial'}
            onChange={handleDisplayDropdownChange}
            defaultValue={display}
          >
            {DISPLAY.map(({ value, label }) => (
              <MenuItem key={value} value={value} dense>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {display === 'flex' && <FlexProperties />}
      {!!display && ['grid', 'inline-grid'].includes(display) && (
        <PlaceItemsProperties reversed={false} />
      )}
    </>
  );
};

export default withConfigurableProperties(Display);
