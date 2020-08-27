import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { ScreenshotElement } from '$api/types';
import { StylesHeader } from '$features/applyProperties/views/components/StylesHeader/StylesHeader';

const styles = require('./BackgroundPosition.scss');

function mapState(state: AppReduxState) {
  const backgroundPosition = selectors.selectCurrentEditableStyles(
    state,
    'background-position',
  );

  return {
    backgroundPosition,
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<ScreenshotElement>;

const BackgroundPosition: React.FC<Props> = ({
  backgroundPosition,
  updateStyles,
  removeStyles,
}) => {
  const [leftPosition, topPosition] = backgroundPosition.split(' ');

  const handleTopPositionFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'background-position': `${leftPosition} ${value}%` });
  };

  const handleLeftPositionFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'background-position': `${value}% ${topPosition}` });
  };

  return (
    <>
      <div className="propsElementsBlock">
        <StylesHeader
          title="Background position"
          onClick={removeStyles}
          cssPropertiesNames={['background-position']}
        />
        <div className={styles.container}>
          <label className={styles.label}>
            <span>Top</span>
            <input
              className={styles.textField}
              type="number"
              value={parseFloat(topPosition)}
              onChange={handleTopPositionFieldChange}
            />
          </label>
          <label className={styles.label}>
            <span>Left</span>
            <input
              className={styles.textField}
              type="number"
              value={parseFloat(leftPosition)}
              onChange={handleLeftPositionFieldChange}
            />
          </label>
        </div>
      </div>
    </>
  );
};

const Component = connect(mapState)(
  withConfigurableProperties(BackgroundPosition),
);
export { Component as BackgroundPosition };
