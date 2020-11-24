import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { DISPLAY } from './constants';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import FlexProperties from '../../helperComponents/Display/FlexProperties';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';
import PlaceItemsProperties from '../../helperComponents/Display/PlaceItemsProperties';
import { StyledTextField } from '../../../../styledComponents';

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

        <StyledTextField
          fullWidth
          margin="dense"
          label="Display"
          value={display || 'initial'}
          onChange={handleDisplayDropdownChange}
          defaultValue={display}
          select
        >
          {DISPLAY.map(({ value, label }) => (
            <MenuItem key={value} value={value} dense>
              {label}
            </MenuItem>
          ))}
        </StyledTextField>
      </div>

      {display === 'flex' && <FlexProperties />}
      {!!display && ['grid', 'inline-grid'].includes(display) && (
        <PlaceItemsProperties reversed={false} />
      )}
    </>
  );
};

export default withConfigurableProperties(Display);
