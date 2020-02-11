import React, { memo, useCallback } from 'react';
import cn from 'classnames';

import { Flex } from '$redux/project/types';
import { DropDown } from '$components/UI/DropDown/';
import { Button } from '$components/UI/Button/';
import {
  withConfigurableProperties,
  PropertiesChangeProps
} from '$utils/withConfigurableProperties';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { JUSTIFY_VALUES, ALIGN_VALUES } from './constants';
const styles = require('./FlexProperties.scss');

type Orientation = 'vertical' | 'horizontal';
type Align = 'align' | 'justify';

type StateProps = {
  displayStyles: Flex;
};

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo((props) => {
  const { displayStyles, updateStyles } = props;

  const orientation: Orientation = displayStyles.display === 'flex'
    && (displayStyles.flexDirection === 'row' 
    || displayStyles.flexDirection === 'row-reverse')
    ? 'horizontal' 
    : 'vertical';

  const renderLabel = useCallback((reversed: boolean) => (
    <span className={styles.axis__label}>{reversed ? 'Y-' : 'X-'} axis</span>
  ), []);

  const handleAlignDropDownChange = useCallback((type: Align, value: string) => {
    updateStyles({ [type === 'align' ? 'align-items' : 'justify-content']: value });
  }, [updateStyles]);

  const handleOrientationDropDownChange = useCallback((value: Orientation) => {
    updateStyles({ 'flex-direction': value === 'vertical' ? 'column' : 'row' });
  }, [updateStyles]);

  return (
    <>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Direction" />
        </header>
        <div className={styles.content}>
          <Button
            styleType="primary"
            className={cn('propsPanelBtn', styles.orientationBtn, orientation === 'horizontal' && 'propsPanelBtn_active')}
            onClick={() => handleOrientationDropDownChange('horizontal')}
          >
            Horizontal
          </Button>
          <Button
            styleType="primary"
            className={cn('propsPanelBtn', styles.orientationBtn, styles.orientationBtn_vertical, orientation === 'vertical' && 'propsPanelBtn_active')}
            onClick={() => handleOrientationDropDownChange('vertical')}
          >
            Vertical
          </Button>
        </div>
      </section>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Align" />
        </header>
        <div className={cn(styles.axises, orientation === 'vertical' && styles.axises_reversed)}>
          <div className={styles.axises__axis}>
            {renderLabel(orientation === 'vertical')}
            <DropDown
              options={JUSTIFY_VALUES}
              defaultValue={displayStyles.justifyContent}
              value={displayStyles.justifyContent}
              onChange={(value) => handleAlignDropDownChange('justify', value)}
            />
          </div>
          <div className={styles.axises__axis}>
            {renderLabel(orientation === 'horizontal')}
            <DropDown
              options={ALIGN_VALUES}
              defaultValue={displayStyles.alignItems}
              value={displayStyles.alignItems}
              onChange={(value) => handleAlignDropDownChange('align', value)}
            />
          </div>
        </div>
      </section>
    </>
  );
});

export const FlexProperties = withConfigurableProperties(Component);
