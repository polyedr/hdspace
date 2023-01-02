import { IconButton, Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import React from 'react';

const useStyles = makeStyles<Theme>(({ typography, palette }) => ({
  title: {
    padding: '0.5em 1em',
    '&:hover $editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },
  relativeTitle: {
    padding: '0.5em 1em',
    '&:hover $editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },
  projectName: {
    fontSize: '14px',
    color: 'black',
    fontFamily: typography.fontFamily,
    fontWeight: 'bold !important',
  },
  editButton: {
    color: palette.common.black,
    opacity: 0,
    transition: 'opacity 0.1s ease',
  },
}));
const RenameProjectBar = ({
  projectName,
  userIdCreator,
  userId,
  handleEditClick,
}) => {
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const isRenameProject = userIdCreator === userId;
  return (
    <div
      className={currentScreenId === -1 ? classes.title : classes.relativeTitle}
    >
      <Typography className={classes.projectName}>{projectName}</Typography>
      {isRenameProject && (
        <IconButton
          onClick={handleEditClick}
          className={classes.editButton}
          size="small"
          title="Rename project"
        >
          <EditIcon sx={{ width: '16px' }} />
        </IconButton>
      )}
    </div>
  );
};

export default RenameProjectBar;
