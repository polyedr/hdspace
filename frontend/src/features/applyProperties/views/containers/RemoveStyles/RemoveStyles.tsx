import React, { memo } from 'react';

import { Button } from '$components/UI/Button';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';
import { connect } from 'react-redux';

const styles = require('./RemoveStyles.scss');

type OwnProps = {
  ruleNames: string[];
  onClick(ruleNames: string[]): void;
};

const mapState = (state: AppReduxState) => {
  return {
    editableStyles: selectors.selectEditableStyles(state),
  }
};

type Props = OwnProps & ReturnType<typeof mapState>;

const RemoveStyles = memo((props: Props) => {
  const { onClick, ruleNames, editableStyles } = props;

  const handleButtonClick = () => {
    onClick(ruleNames);
  };

  return editableStyles === 'idStyles' ? (
    <Button className={styles.button} styleType="grey" onClick={handleButtonClick}>Clear styles</Button>
  ) : null;
});

const Component = connect(mapState)(RemoveStyles);
export { Component as RemoveStyles };