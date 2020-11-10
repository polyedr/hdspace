import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DISPLAY from './constants';
import { convertFlexToCssLikeStyles } from '../../../../../utils/StyleHelper';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectDisplayStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import FlexProperties from '../../helperComponents/FlexProperties';
import {
  Entity,
  Flex,
  LibraryElement,
  PropertiesChangeProps,
  ScreenDisplay,
} from '../../../../../types';

type StateProps = {
  displayStyles: ScreenDisplay;
};

type Props = StateProps & PropertiesChangeProps<LibraryElement<Entity>>;

const Display: React.FC<Props> = ({ updateStyles, removeStyles }) => {
  const displayStyles = useSelector(selectDisplayStyles);

  const handleDisplayDropdownChange = (event) => {
    updateStyles({ display: event.target.value });
  };

  const handleFlexPropertiesChange = useCallback(
    (prop: keyof Flex, value: Flex[keyof Flex]) => {
      const styles = convertFlexToCssLikeStyles({ [prop]: value });
      updateStyles(styles);
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
            'justify-content',
            'align-items',
            'flex-direction',
          ]}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Display</InputLabel>

          <Select
            margin="dense"
            label="Display"
            value={displayStyles.display}
            onChange={handleDisplayDropdownChange}
            defaultValue={displayStyles.display}
          >
            {DISPLAY.map(({ value, label }) => (
              <MenuItem key={value} value={value} dense>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {displayStyles.display === 'flex' && (
        <FlexProperties
          properties={displayStyles}
          onChange={handleFlexPropertiesChange}
        />
      )}
    </>
  );
};

export default withConfigurableProperties(memo(Display));
