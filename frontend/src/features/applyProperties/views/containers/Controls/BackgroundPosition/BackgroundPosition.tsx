import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { ScreenshotElement } from '$api/types';

import { ControlSection } from '../../../components/ControlSection/ControlSection';

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
      <ControlSection title="Background position">
        <div className={styles.container}>
          <input
            className={styles.textField}
            type="number"
            value={parseFloat(topPosition)}
            min={0}
            onChange={handleTopPositionFieldChange}
          />
          <input
            className={styles.textField}
            type="number"
            value={parseFloat(leftPosition)}
            min={0}
            onChange={handleLeftPositionFieldChange}
          />
        </div>
      </ControlSection>
    </>
  );
};

const Component = connect(mapState)(
  withConfigurableProperties(BackgroundPosition),
);
export { Component as BackgroundPosition };
