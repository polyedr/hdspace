/* eslint-disable react/no-unused-prop-types */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { Entity } from '@Src/types';

interface Props {
  propsToRemove?: string[];
  onClick: (propsToRemove: string[] | undefined) => void;
  type: Entity | 'none';
  editableStyles: string;
}

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  removeButton: {
    padding: '1px 5px !important',
    color: '#81818E',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px !important',
    lineHeight: '135%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(129, 129, 142, 0.1)',
    },
    '&:active': {
      backgroundColor: 'rgba(80, 100, 255, 0.1)',
    },
  },
  icon: { color: '#81818E' },
});

const RemoveStyles: React.FC<Props> = ({ onClick, propsToRemove }) => {
  const classes = useStyles();
  const editableStyles = useSelector(selectEditableStyles);
  const activeItem = useSelector(selectActiveElement);

  const handleButtonClick = () => {
    onClick(propsToRemove);
  };

  const showClearButton =
    activeItem.type !== 'root' && editableStyles !== activeItem.type;

  return (
    <div className={classes.header}>
      {showClearButton && (
        <button
          type="button"
          className={classes.removeButton}
          onClick={handleButtonClick}
        >
          <ClearIcon className={classes.icon} sx={{ width: '16px' }} />
          <div>Reset</div>
        </button>
      )}
    </div>
  );
};

export default memo(RemoveStyles);
