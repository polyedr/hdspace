import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import {
  selectActiveElement,
  selectEditableStyles,
} from '../../../../../redux/project/selectors';
import { setEditableStyles } from '../../../../../redux/project/actions';
import { AppReduxState } from '../../../../../redux/types';
import { StyledTextField } from '../../../../styledComponents';

type StateProps = {
  editableStyles: string;
  classNames: string[];
};

const mapState = (state: AppReduxState) => {
  const activeElement = selectActiveElement(state);
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
  const handleDropdownChange = (ev) => {
    setEditableStyles(ev.target.value);
  };

  return (
    <StyledTextField
      fullWidth
      label="Styles to edit"
      defaultValue={editableStyles}
      value={editableStyles}
      onChange={handleDropdownChange}
      select
    >
      {classNames.map((className) => (
        <MenuItem key={className} value={className}>
          {className}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default connect(mapState, mapDispatch)(EditableStyles);
