import React from 'react';

import { connect } from 'react-redux';
import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
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
  };
};

const mapDispatch = {
  setEditableStyles: actionsCreators.setEditableStyles,
};

type Props = StateProps & typeof mapDispatch;

const EditableStyles: React.FC<Props> = ({
  editableStyles,
  classNames,
  setEditableStyles,
}) => {
  const handleDropdownChange = (value: string) => {
    setEditableStyles(value);
  };

  return (
    <DropDown
      options={classNames.map((className) => ({
        label: className,
        value: className,
      }))}
      defaultValue={editableStyles}
      value={editableStyles}
      onChange={handleDropdownChange}
    />
  );
};

export default connect(mapState, mapDispatch)(EditableStyles);
