import React from 'react';

import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { connect } from 'react-redux';
import { DropDown } from '$components/UI/DropDown';
import { findChildByID } from '$utils/ElementsTreeHelper';

type StateProps = {
  editableStyles: string;
  classNames: string[];
};

const mapState = (state: AppReduxState) => {
  const activeItem = selectors.selectActiveItem(state);
  const root = selectors.selectRootElement(state);
  const activeElement = findChildByID(root, activeItem.itemId);
  const classNames = [...(activeElement?.styles.classNames || []), 'ownStyles'];
  const editableStyles = selectors.selectEditableStyles(state);

  return {
    editableStyles,
    classNames,
  }
};

const mapDispatch = {
  setEditableStyles: actionsCreators.setEditableStyles,
};

type Props = StateProps & typeof mapDispatch;

const EditableStyles = (props: Props) => {
  const { editableStyles, classNames, setEditableStyles } = props;

  const handleDropdownChange = (value: string) => {
    setEditableStyles(value);
  };

  return (
    <DropDown
      options={classNames.map(className => ({ label: className, value: className }))}
      defaultValue={editableStyles}
      value={editableStyles}
      onChange={handleDropdownChange}
    />
  );
};

const Component = connect(mapState, mapDispatch)(EditableStyles);
export { Component as EditableStyles };
