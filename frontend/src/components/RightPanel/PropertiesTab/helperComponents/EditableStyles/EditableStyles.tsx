import React from 'react';
import { connect } from 'react-redux';
import { setEditableStyles } from '@Redux/project/actions';
import { AppReduxState } from '@Redux/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StyledTextField } from '@Components/styledComponents';
import { splitWords } from '@Utils/stringHelper';
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
  capitalized: {
    textTransform: 'capitalize',
  },
});

type StateProps = {
  editableStyles: string;
  classNames: string[];
  disabled?: boolean;
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
  disabled,
}) => {
  const classes = useStyles();

  const handleDropdownChange = (ev) => {
    setEditableStyles(ev.target.value);
  };

  return (
    <StyledTextField
      fullWidth
      label="Styles to edit"
      value={editableStyles}
      onChange={handleDropdownChange}
      select
      className={classes.capitalized}
      disabled={disabled}
    >
      {classNames.map((className) => (
        <MenuItem
          key={className}
          value={className}
          className={classes.capitalized}
        >
          {splitWords(className)}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default connect(mapState, mapDispatch)(EditableStyles);
