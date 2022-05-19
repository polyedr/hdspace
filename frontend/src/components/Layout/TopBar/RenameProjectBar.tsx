import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { useSelector } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import React from 'react';

const useStyles = makeStyles(({ typography, palette }) => ({
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
    position: 'relative',
    left: '17%',
    '&:hover $editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },
  projectName: {
    fontSize: '1rem',
    color: 'black',
    fontFamily: typography.fontFamily,
    fontWeight: 'bold',
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
      <Typography variant="h6" className={classes.projectName}>
        {projectName}
      </Typography>
      {isRenameProject && (
        <IconButton
          onClick={handleEditClick}
          className={classes.editButton}
          size="small"
          title="Rename project"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default RenameProjectBar;
