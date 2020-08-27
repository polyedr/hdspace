import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { ContainerElement } from '$api/types';

import { ControlSection } from '../../../components/ControlSection/ControlSection';

const styles = require('./FlexGrow.scss');

function mapState(state: AppReduxState) {
  const flexGrow = selectors.selectCurrentEditableStyles(state, 'flex-grow');
  const activeItemID = selectors.selectActiveItem(state).itemId;

  return {
    flexGrow,
    activeItemID,
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<ContainerElement>;

const FlexGrow: React.FC<Props> = ({
  flexGrow,
  activeItemID,
  updateStyles,
}) => {
  const el = document.getElementById(activeItemID);
  const parentStyles = el?.parentElement && getComputedStyle(el.parentElement);
  const isFlexItem = parentStyles?.display === 'flex';

  const handleTextFieldChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles({ 'flex-grow': Number(value) });
  };

  return isFlexItem ? (
    <>
      <ControlSection title="Flex grow">
        <>
          <input
            className={styles.textField}
            type="number"
            value={flexGrow}
            min={0}
            onChange={handleTextFieldChange}
          />
        </>
      </ControlSection>
    </>
  ) : null;
};

const Component = connect(mapState)(withConfigurableProperties(FlexGrow));
export { Component as FlexGrow };
