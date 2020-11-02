import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FlexProperties from '../../../components/FlexProperties/FlexProperties';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import DISPLAY from './constants';
import { Entity } from '../../../../../../domain/core';
import { LibraryElement } from '../../../../../../api/types';
import { Flex, ScreenDisplay } from '../../../../../../redux/project/types';
import {
  convertFlexToCssLikeStyles,
  CssLikeStyles,
} from '../../../../../../utils/StyleHelper';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { assertNever } from '../../../../../../shared/helpers/ts';
import { selectDisplayStyles } from '../../../../../../redux/project/selectors';

type StateProps = {
  displayStyles: ScreenDisplay;
};

export function getDisplayStyles(
  activeItemStyles: Pick<
    Required<CssLikeStyles>,
    'display' | 'flex-direction' | 'justify-content' | 'align-items'
  >,
): ScreenDisplay {
  switch (activeItemStyles.display) {
    case 'block':
      return {
        display: activeItemStyles.display,
      };

    case 'inline':
      return {
        display: activeItemStyles.display,
      };

    case 'inline-block':
      return {
        display: activeItemStyles.display,
      };

    case 'flex':
      return {
        display: activeItemStyles.display,
        justifyContent: activeItemStyles['justify-content'],
        alignItems: activeItemStyles['align-items'],
        flexDirection: activeItemStyles['flex-direction'],
      };

    default:
      return assertNever(activeItemStyles.display);
  }
}

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

        <FormControl fullWidth>
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
