import React from 'react';

import { connect } from 'react-redux';
import { DropDown } from '../../../../../components/UI/DropDown';
import { findChildByID } from '../../../../../utils/ElementsTreeHelper';
import { AppReduxState } from '../../../../../shared/types/app';
import {
  selectActiveItem,
  selectEditableStyles,
  selectRootElement,
} from '../../../../../redux/project/selectors';
import { setEditableStyles } from '../../../../../redux/project/actions';

type StateProps = {
  editableStyles: string;
  classNames: string[];
};

const mapState = (state: AppReduxState) => {
  const activeItem = selectActiveItem(state);
  const root = selectRootElement(state);
  const activeElement = findChildByID(root, activeItem.itemId);
  const classNames = [...(activeElement?.styles.classNames || []), 'ownStyles'];
  const editableStyles = selectEditableStyles(state);

  return {
    editableStyles,
    classNames,
  };
};

const mapDispatch = {
  setEditableStyles,
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
