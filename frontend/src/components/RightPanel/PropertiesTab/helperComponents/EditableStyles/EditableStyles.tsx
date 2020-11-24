import React from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { setEditableStyles } from '@Redux/project/actions';
import { AppReduxState } from '@Redux/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';

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
    <FormControl fullWidth>
      <InputLabel>Styles to edit</InputLabel>
      <Select
        defaultValue={editableStyles}
        value={editableStyles}
        onChange={handleDropdownChange}
      >
        {classNames.map((className) => (
          <MenuItem key={className} value={className}>
            {className}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default connect(mapState, mapDispatch)(EditableStyles);
