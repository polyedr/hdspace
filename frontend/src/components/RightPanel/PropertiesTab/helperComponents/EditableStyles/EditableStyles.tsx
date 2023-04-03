import React from 'react';
import { connect } from 'react-redux';
import { MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { setEditableStyles } from '@Redux/project/actions';
import { AppReduxState } from '@Redux/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { StyledTextField } from '@Components/styledComponents';
import { splitWords } from '@Utils/stringHelper';

const useStyles = makeStyles({
  capitalized: {
    textTransform: 'capitalize',
  },
  text: {
    color: 'rgba(129, 129, 142, 1)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '135%',
    fontFamily: 'Roboto',
    marginTop: 5,
  },
});

interface StateProps {
  editableStyles: string;
  classNames: string[];
  disabled?: boolean;
}

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
    <>
      <StyledTextField
        fullWidth
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
      <div className={classes.text}>Styles to edit</div>
    </>
  );
};

export default connect(mapState, mapDispatch)(EditableStyles);
