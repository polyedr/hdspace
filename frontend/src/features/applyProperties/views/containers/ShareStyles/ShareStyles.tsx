import React from 'react';

import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { connect } from 'react-redux';
import { findChildByID } from '$utils/ElementsTreeHelper';
import { Button } from '$components/UI/Button';

const styles = require('./ShareStyles.scss');

const mapState = (state: AppReduxState) => {
  const activeItem = selectors.selectActiveItem(state);
  const root = selectors.selectRootElement(state);
  const activeElement = findChildByID(root, activeItem.itemId);
  const classNames = [...(activeElement?.styles.classNames || []), 'idStyles'];
  const editableStyles = selectors.selectEditableStyles(state);
  const copiedStyles = selectors.selectCopiedStyles(state);

  return {
    activeElement,
    copiedStyles,
  }
};

const mapDispatch = {
  copyStyles: actionsCreators.copyElementStyles,
  pasteStyles: actionsCreators.pasteElementStyles,
};

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

const ShareStyles = (props: Props) => {
  const { activeElement, copiedStyles, copyStyles, pasteStyles } = props;

  const handleCopyButtonClick = () => {
    activeElement && copyStyles(activeElement.type, activeElement.id, activeElement.styles.idStyles);
  };

  const handlePasteButtonClick = () => {
    copiedStyles && activeElement && pasteStyles(activeElement.id);
  };

  return (
    <div className={styles.container}>
      <Button className={styles.shareButton} onClick={handleCopyButtonClick}>Share styles</Button>
      {copiedStyles && <Button onClick={handlePasteButtonClick}>Apply shared styles</Button>}
    </div>
  );
};

const Component = connect(mapState, mapDispatch)(ShareStyles);
export { Component as ShareStyles };
