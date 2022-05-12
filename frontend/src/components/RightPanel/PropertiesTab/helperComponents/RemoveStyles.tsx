/* eslint-disable react/no-unused-prop-types */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { Entity } from '@Src/types';
import Button from '../../../UI/Button';

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
    fontSize: '7px !important',
  },
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
        <Button
          className={classes.removeButton}
          styleType="grey"
          onClick={handleButtonClick}
        >
          Clear styles
        </Button>
      )}
    </div>
  );
};

export default memo(RemoveStyles);
