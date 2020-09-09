import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import FlexProperties from '../../../components/FlexProperties/FlexProperties';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import DISPLAY from './constants';
import { DropDown } from '../../../../../../components/UI/DropDown';
import { Entity } from '../../../../../../domain/core';
import { AppReduxState } from '../../../../../../shared/types/app';
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
import { selectCurrentEditableStyles } from '../../../../../../redux/project/selectors';

type StateProps = {
  displayStyles: ScreenDisplay;
};

function getDisplayStyles(
  activeItemStyles: Pick<
    Required<CssLikeStyles>,
    'display' | 'flex-direction' | 'justify-content' | 'align-items'
  >,
): ScreenDisplay {
  // console.log(activeItemStyles);
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

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = {
    display: selectCurrentEditableStyles(state, 'display'),
    'justify-content': selectCurrentEditableStyles(state, 'justify-content'),
    'align-items': selectCurrentEditableStyles(state, 'align-items'),
    'flex-direction': selectCurrentEditableStyles(state, 'flex-direction'),
  };

  return { displayStyles: getDisplayStyles(activeItemStyles) };
}

type Props = StateProps & PropertiesChangeProps<LibraryElement<Entity>>;

const Display: React.FC<Props> = ({
  displayStyles,
  updateStyles,
  removeStyles,
}) => {
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
      <section className="propsElementsBlock">
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
        <div className="propsElementsContentBlock">
          <div className="propsElementsInnerBlock">
            <DropDown
              options={DISPLAY}
              defaultValue={displayStyles.display}
              value={displayStyles.display}
              onChange={handleDisplayDropdownChange}
            />
          </div>
        </div>
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

export default connect(mapState)(withConfigurableProperties(memo(Display)));
