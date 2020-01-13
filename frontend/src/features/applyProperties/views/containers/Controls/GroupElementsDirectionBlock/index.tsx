import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors } from '$redux/project/';
import { Button } from '$components/UI/Button/';
import { DropDown } from '$components/UI/DropDown/';
import { withPropsChangeHandler, PropertiesChangeHandler } from '$utils/withPropsChangeHandler';

import { ControlTitle } from '../../../components/ControlTitle/ControlTitle';
import { JUSTIFY_VALUES, ALIGN_VALUES } from './constants';
import { CssLikeStyles } from '$utils/StyleHelper';
const styles = require('./styles.scss');

type Orientation = 'vertical' | 'horizontal';
type Align = 'align' | 'justify';

type StateProps = {
  activeItemID: string;
  justifyContent: string;
  alignItems: string;
  orientation: Orientation;
};

type Props = StateProps & typeof mapDispatch & PropertiesChangeHandler;

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    activeItemID: selectors.selectActiveItem(state).itemId,
    justifyContent: activeItemStyles['justify-content'],
    alignItems: activeItemStyles['align-items'],
    orientation: activeItemStyles['flex-direction'] === 'row' ? 'horizontal' : 'vertical',
  };
}

const mapDispatch = {
  updateElementStyles: actionsCreators.updateElementStyles,
  updateScenarioStyles: actionsCreators.updateScenarioStyles,
};

const Component: React.FC<Props> = memo((props) => {
  const {
    orientation,
    justifyContent,
    alignItems,
    updateStyles,
    activeItemID,
  } = props;

  if (activeItemID === 'none') return null;
 
  const renderLabel = useCallback((reversed: boolean) => (
    <span className={styles.axises__label}>{reversed ? 'Cross' : 'Main'} axis</span>
  ), []);

  const handleAlignChange = useCallback((type: Align, value: string) => {
    updateStyles({ [type === 'align' ? 'align-items' : 'justify-content']: value });
  }, [updateStyles]);

  const handleOrientationChange = useCallback((value: Orientation) => {
    updateStyles({ 'flex-direction': value === 'vertical' ? 'column' : 'row' });
  }, [updateStyles]);

  return (
    <React.Fragment>
      <section className="propsElementsBlock">
        <header className={styles.align__header}>
          <ControlTitle content="Direction" />
        </header>
        <div className={styles.align__content}>
          <Button
            styleType="primary"
            className={cn('propsPanelBtn', styles.orientationBtn, orientation === 'horizontal' && 'propsPanelBtn_active')}
            onClick={() => handleOrientationChange('horizontal')}
          >
            Horizontal
          </Button>
          <Button
            styleType="primary"
            className={cn('propsPanelBtn', styles.orientationBtn, styles.orientationBtn_vertical, orientation === 'vertical' && 'propsPanelBtn_active')}
            onClick={() => handleOrientationChange('vertical')}
          >
            Vertical
          </Button>
        </div>
      </section>
      <section className="propsElementsBlock">
        <header className={styles.align__header}>
          <ControlTitle content="Align" />
        </header>
        <div className={cn(styles.axises, orientation === 'vertical' && styles.axises_reversed)}>
          <div className={styles.axises__axis}>
            {renderLabel(orientation === 'vertical')}
            <DropDown
              options={JUSTIFY_VALUES}
              defaultValue={justifyContent}
              value={justifyContent}
              onChange={(value) => handleAlignChange('justify', value)}
            />
          </div>
          <div className={styles.axises__axis}>
            {renderLabel(orientation === 'horizontal')}
            <DropDown
              options={ALIGN_VALUES}
              defaultValue={alignItems}
              value={alignItems}
              onChange={(value) => handleAlignChange('align', value)}
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  )
});

const GroupElementsDirectionBlock = connect(mapState, mapDispatch)(withPropsChangeHandler(Component));
export { GroupElementsDirectionBlock };
