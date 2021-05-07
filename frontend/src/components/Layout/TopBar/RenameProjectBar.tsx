import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

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
  projectName: {
    fontSize: '1rem',
    fontFamily: typography.fontFamily,
    fontWeight: 'bold',
  },
  editButton: {
    color: palette.common.white,
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
  const isRenameProject = userIdCreator === userId;
  return (
    <>
      {isRenameProject ? (
        <div className={classes.title}>
          <Typography variant="h6" className={classes.projectName}>
            {projectName}
          </Typography>
          <IconButton
            onClick={handleEditClick}
            className={classes.editButton}
            size="small"
            title="Rename project"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <div className={classes.title}>
          <Typography variant="h6" className={classes.projectName}>
            {projectName}
          </Typography>
        </div>
      )}
    </>
  );
};

export default RenameProjectBar;
