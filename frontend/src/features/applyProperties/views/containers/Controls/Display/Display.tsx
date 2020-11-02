import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import FlexProperties from '../../../components/FlexProperties/FlexProperties';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import DISPLAY from './constants';
import { DropDown } from '../../../../../../components/UI/DropDown';
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

  const handleDisplayDropdownChange = useCallback(
    (value) => {
      updateStyles({ display: value });
    },
    [updateStyles],
  );

  const handleFlexPropertiesChange = useCallback(
    (prop: keyof Flex, value: Flex[keyof Flex]) => {
      const styles = convertFlexToCssLikeStyles({ [prop]: value });
      updateStyles(styles);
    },
    [updateStyles],
  );

  return (
    <>
      <section>
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

        <DropDown
          options={DISPLAY}
          defaultValue={displayStyles.display}
          value={displayStyles.display}
          onChange={handleDisplayDropdownChange}
        />
      </section>

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
