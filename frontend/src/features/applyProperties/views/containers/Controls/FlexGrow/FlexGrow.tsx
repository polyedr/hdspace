import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { ContainerElement } from '$api/types';

import { StylesHeader } from '$features/applyProperties/views/components/StylesHeader/StylesHeader';

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
  removeStyles,
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
    <div className={styles.container}>
      <StylesHeader
        title="Flex Grow"
        onClick={removeStyles}
        cssPropertiesNames={['flex-grow']}
      />
      <div>
        <input
          className={styles.textField}
          type="number"
          value={flexGrow}
          min={0}
          onChange={handleTextFieldChange}
        />
      </div>
    </div>
  ) : null;
};

const Component = connect(mapState)(withConfigurableProperties(FlexGrow));
export { Component as FlexGrow };
