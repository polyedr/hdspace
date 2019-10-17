import React, { memo } from 'react';
import classNames from 'classnames';

import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';

const styles = require('./styles.scss');

interface IComponentProps {
  orientation: IPanelEditProps['orientation'],
  params: IPanelEditProps['params'],
  onAlign: IPanelEditProps['onAlign'],
  setOrientation: IPanelEditProps['setOrientation'],
}

export const GroupElementsDirectionBlock: React.FunctionComponent<IComponentProps> = memo(({
  orientation,
  params,
  setOrientation,
  onAlign,
}) => (
  <React.Fragment>
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Direction</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <Button
            styleType="primary"
            className={classNames('propsPanelBtn', styles.orientationBtn, styles.orientationBtn_vertical, orientation === 'vertical' && 'propsPanelBtn_active')}
            onClick={() => setOrientation('vertical')}
          >
            Vertical
          </Button>
          <Button
            styleType="primary"
            className={classNames('propsPanelBtn', styles.orientationBtn, orientation === 'horizontal' && 'propsPanelBtn_active')}
            onClick={() => setOrientation('horizontal')}
          >
            Horizontal
          </Button>
        </div>
      </div>
    </div>
    {orientation === 'horizontal' && (
      <div className="propsElementsBlock">
        <p className="propsElementsBlockTitle">Align</p>
        <div className="propsElementsContentBlock">
          <div className="propsElementsInnerBlock">
            <Button
              styleType="none"
              className={classNames('propsPanelImgBtn', params && params.align === 'left' ? styles.active : '')}
              onClick={() => onAlign('left')}
            >
              <Icon icon="align_left" />
            </Button>
            <Button
              styleType="none"
              className={classNames('propsPanelImgBtn', params && params.align === 'center' ? styles.active : '')}
              onClick={() => onAlign('center')}
            >
              <Icon icon="align_center" />
            </Button>
            <Button
              styleType="none"
              className={classNames('propsPanelImgBtn', params && params.align === 'right' ? styles.active : '')}
              onClick={() => onAlign('right')}
            >
              <Icon icon="align_right" />
            </Button>
            <Button
              styleType="none"
              className={classNames('propsPanelImgBtn', params && params.align === 'justify' ? styles.active : '')}
              onClick={() => onAlign('justify')}
            >
              <Icon icon="align_justify" />
            </Button>
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
));
