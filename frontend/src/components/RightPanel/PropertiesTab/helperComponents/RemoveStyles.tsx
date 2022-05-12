/* eslint-disable react/no-unused-prop-types */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { Entity } from '@Src/types';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
  propsToRemove?: string[];
  onClick(propsToRemove: string[] | undefined): void;
  type: Entity | 'none';
  editableStyles: string;
};

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
  },
  icon: { width: '16px', height: '16px', color: '#81818E' },
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
        // eslint-disable-next-line react/button-has-type
        <button className={classes.removeButton} onClick={handleButtonClick}>
          <ClearIcon className={classes.icon} />
          <div>Reset</div>
        </button>
      )}
    </div>
  );
};

export default memo(RemoveStyles);
