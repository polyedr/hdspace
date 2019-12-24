import React, { memo } from 'react';
import classNames from 'classnames';

import { Button } from '$components/UI/Button/';
import { DropDown } from '$components/UI/DropDown/';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';

const styles = require('./styles.scss');

type Props = {
  styleItem: IPanelEditProps['styleItem'];
  orientation: IPanelEditProps['orientation'];
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
}) => (
  <React.Fragment>
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Direction</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <Button
            styleType="primary"
            className={classNames('propsPanelBtn', styles.orientationBtn, orientation === 'horizontal' && 'propsPanelBtn_active')}
            onClick={() => setOrientation('horizontal')}
          >
            Horizontal
          </Button>
          <Button
            styleType="primary"
            className={classNames('propsPanelBtn', styles.orientationBtn, styles.orientationBtn_vertical, orientation === 'vertical' && 'propsPanelBtn_active')}
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
        <div className={styles.axis}>
          <span className={styles.axis__label}>{orientation === 'horizontal' ? 'Main' : 'Cross'} axis</span>
          <DropDown
            options={JUSTIFY_VALUES}
            defaultValue={orientation === 'horizontal' ? styleItem['justify-content'] : styleItem['align-items']}
            value={orientation === 'horizontal' ? styleItem['justify-content'] : styleItem['align-items']}
            onChange={(value) => onAlignChange(orientation === 'horizontal' ? 'justify' : 'align', value)}
          />
        </div>
        <div className={styles.axis}>
          <span className={styles.axis__label}>{orientation === 'horizontal' ? 'Cross' : 'Main'} axis</span>
          <DropDown
            options={ALIGN_VALUES}
            defaultValue={orientation === 'horizontal' ? styleItem['align-items'] : styleItem['justify-content']}
            value={orientation === 'horizontal' ? styleItem['align-items'] : styleItem['justify-content']}
            onChange={(value) => onAlignChange(orientation === 'horizontal' ? 'align' : 'justify', value)}
          />
        </div>
      </div>
  </div>
  </React.Fragment>
));
