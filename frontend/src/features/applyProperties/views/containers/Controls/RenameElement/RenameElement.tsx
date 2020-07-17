import React, { useState, useEffect } from 'react';

import { TextField } from '$features/applyProperties/views/components/TextField/TextField';
import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { connect } from 'react-redux';

type StateProps = {
  activeItemID: string;
  activeItemName: string;
};

const mapState = (state: AppReduxState) => {
  const activeItem = selectors.selectActiveItem(state);

  return {
    activeItemID: activeItem.itemId,
    activeItemName: activeItem.name,
  }
};

const mapDispatch = {
  renameElement: actionsCreators.renameElement,
};

type Props = StateProps & typeof mapDispatch;

const RenameElement = (props: Props) => {
  const { activeItemID, activeItemName, renameElement } = props;
  const [currentElementName, setCurrentElementName] = useState(activeItemName);

  useEffect(() => {
    setCurrentElementName(activeItemName);
  }, [activeItemName]);

  const handleTextFieldBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => {
    renameElement(activeItemID, value);
  }

  return (
    <TextField
      value={currentElementName}
      onBlur={handleTextFieldBlur}
      onChange={({ target: { value } }) => setCurrentElementName(value)}
    />
  );
};

const Component = connect(mapState, mapDispatch)(RenameElement);
export { Component as RenameElement };
