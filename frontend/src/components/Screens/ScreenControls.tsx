import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { darken } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Screen } from '../../redux/project/types';
import { delScreen, duplicateScreen } from '../../redux/project/actions';

const useStyles = makeStyles({
  root: {
    opacity: (show: boolean) => +show,
    transition: 'opacity .1s ease-in-out',
  },
  iconButton: {
    height: 16,
    width: 16,
    color: '#eee',
    '&:hover': {
      backgroundColor: darken('#2f4050', 0.2),
    },
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

  const dispatch = useDispatch();
  const classes = useStyles(show);

  const handleDelete = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(delScreen(project, id));
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

      <IconButton
        className={classes.iconButton}
        onClick={handleDelete}
        title="Delete"
      >
        <DeleteOutlineIcon />
      </IconButton>
    </div>
  );
};

export default ScreenControls;
