import React, { memo, useCallback } from 'react';
import cn from 'classnames';

import { Button } from '$components/UI/Button/';
import { DropDown } from '$components/UI/DropDown/';

import { IPanelEditProps } from '../PanelEditProps';
const styles = require('./styles.scss');

type Props = {
  styleItem: IPanelEditProps['styleItem'];
  orientation: 'vertical' | 'horizontal';
  params: IPanelEditProps['params'];
  setOrientation: IPanelEditProps['setOrientation'];
  onAlignChange(alignType: 'align' | 'justify', value: string): void;
};

const ALIGN_VALUES = [{
  label: 'Start',
  value: 'flex-start',
}, {
  label: 'Center',
  value: 'center',
}, {
  label: 'End',
  value: 'flex-end',
}, {
  label: 'Stretch',
  value: 'stretch',
}, {
  label: 'Baseline',
  value: 'baseline',
}];

const JUSTIFY_VALUES = [{
  label: 'Start',
  value: 'flex-start',
}, {
  label: 'Center',
  value: 'center',
}, {
  label: 'End',
  value: 'flex-end',
}, {
  label: 'Space between',
  value: 'space-between',
}, {
  label: 'Space around',
  value: 'space-around',
}];

export const GroupElementsDirectionBlock: React.FC<Props> = memo(({
  orientation,
  params,
  setOrientation,
  onAlignChange,
  styleItem
}) => {
  const renderLabel = useCallback((reversed: boolean) => (
    <span className={styles.axis__label}>{reversed ? 'Cross' : 'Main'} axis</span>
  ), [])
  return (
    <React.Fragment>
      <div className="propsElementsBlock">
        <p className="propsElementsBlockTitle">Direction</p>
        <div className="propsElementsContentBlock">
          <div className="propsElementsInnerBlock">
            <Button
              styleType="primary"
              className={cn('propsPanelBtn', styles.orientationBtn, orientation === 'horizontal' && 'propsPanelBtn_active')}
              onClick={() => setOrientation('horizontal')}
            >
              Horizontal
            </Button>
            <Button
              styleType="primary"
              className={cn('propsPanelBtn', styles.orientationBtn, styles.orientationBtn_vertical, orientation === 'vertical' && 'propsPanelBtn_active')}
              onClick={() => setOrientation('vertical')}
            >
              Vertical
            </Button>
          </div>
        </div>
      </div>
      <div className="propsElementsBlock">
        <p className="propsElementsBlockTitle">Align</p>
        <div className="propsElementsContentBlock">
          <div className={cn(styles.axises, orientation === 'vertical' && styles.axises_reversed)}>
            <div className={styles.axis}>
              {renderLabel(orientation === 'vertical')}
              <DropDown
                options={JUSTIFY_VALUES}
                defaultValue={styleItem['justify-content']}
                value={styleItem['justify-content']}
                onChange={(value) => onAlignChange('justify', value)}
              />
            </div>
            <div className={styles.axis}>
              {renderLabel(orientation === 'horizontal')}
              <DropDown
                options={ALIGN_VALUES}
                defaultValue={styleItem['align-items']}
                value={styleItem['align-items']}
                onChange={(value) => onAlignChange('align', value)}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
});
