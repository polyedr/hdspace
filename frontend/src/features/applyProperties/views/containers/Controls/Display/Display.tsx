import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { assertNever } from '$shared/helpers/ts';
import { ScreenDisplay, Flex } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';
import { CssLikeStyles, convertFlexToCssLikeStyles } from '$utils/StyleHelper';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { FlexProperties } from '../../../components/FlexProperties/FlexProperties';
import { DISPLAY } from './constants';
const styles = require('./Display.scss');

type StateProps = {
  displayStyles: ScreenDisplay;
};

function getDisplayStyles(activeItemStyles: Required<CssLikeStyles>): ScreenDisplay {
  switch(activeItemStyles.display) {
    case 'block': return { 
      display: activeItemStyles.display,
    };

    case 'inline': return { 
      display: activeItemStyles.display,
    };

    case 'inline-block': return { 
      display: activeItemStyles.display,
    };

    case 'flex': return {
      display: activeItemStyles.display,
      justifyContent: activeItemStyles['justify-content'],
      alignItems: activeItemStyles['align-items'],
      flexDirection: activeItemStyles['flex-direction'],
    };

    default: return assertNever(activeItemStyles.display);
  }
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state).tagStyles as Required<CssLikeStyles>;
  return { displayStyles: getDisplayStyles(activeItemStyles) };
}

type Props = StateProps & PropertiesChangeProps<LibraryElement<Entity>>;

export const Component: React.FC<Props> = memo((props) => {
  const { displayStyles, updateStyles } = props;

  const handleDisplayDropdownChange = useCallback((value) => {
    updateStyles({ display: value });
  }, [updateStyles]);

  const handleFlexPropertiesChange = useCallback((prop: keyof Flex, value: Flex[keyof Flex]) => {
    const styles = convertFlexToCssLikeStyles({ [prop]: value });
    updateStyles(styles);
  }, [updateStyles]);

  return (
    <>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Display" />
        </header>
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
      {displayStyles.display === 'flex' && <FlexProperties properties={displayStyles} onChange={handleFlexPropertiesChange} />}
    </>
  );
});

export const Display = connect(mapState)(
  withConfigurableProperties(Component)
);
