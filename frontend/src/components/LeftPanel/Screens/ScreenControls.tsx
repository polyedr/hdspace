/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';
import { Theme, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { deleteScreen, duplicateScreen } from '@Redux/project/actions';
import { selectScreensLength } from '@Redux/project/selectors/screen';
import { Screen } from '@Src/types';

const useStyles = makeStyles<Theme, { show: boolean }>({
  root: {
    opacity: ({ show }) => +show,
    transition: 'opacity .1s ease-in-out',
  },
  iconButton: {
    height: 16,
    width: 16,
    color: '#81818E',
    '& svg': {
      height: 18,
      width: 18,
    },
  },
});

type Props = {
  show: boolean;
  screen: Screen;
  openEdit: () => void;
  closeEdit: () => void;
};

const ScreenControls: React.FC<Props> = ({ screen, show, openEdit }) => {
  const { project, id, name } = screen;
  const screensNumber = useSelector(selectScreensLength);
  const canDelete = screensNumber > 2;

  const dispatch = useDispatch();
  const classes = useStyles({ show });

  const handleDelete = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(deleteScreen(project, id));
  };

  const handleCopy = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(duplicateScreen(name, id));
  };

  const handleRenameClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openEdit();
  };

  return (
    <div className={classes.root}>
      <IconButton
        className={classes.iconButton}
        onClick={handleRenameClick}
        title="Edit"
      >
        <EditIcon />
      </IconButton>

      <IconButton
        className={classes.iconButton}
        onClick={handleCopy}
        title="Copy"
      >
        <FileCopyIcon />
      </IconButton>

      {canDelete && (
        <IconButton
          className={classes.iconButton}
          onClick={handleDelete}
          title="Delete"
        >
          <DeleteOutlineIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ScreenControls;
