import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(({ typography }) => ({
  title: {
    padding: '0.5em 1em 0.5em 0',
    '&:hover $editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },
  projectName: {
    fontFamily: typography.fontFamily,
    fontWeight: 'bold',
  },
  editButton: {
    opacity: 0,
    transition: 'opacity 0.1s ease',
  },
  input: {
    '& .MuiInputBase-root': {
      '&::before, &::after': {
        border: 'none !important',
      },
      '& input': {
        fontSize: 24,
        fontWeight: 'bold',
      },
    },
  },
}));

const RenameProjectBar = ({ projectName, onChange }) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(projectName);

  useEffect(() => {
    setName(projectName);
  }, [projectName]);

  const handleModeChange = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (name.trim()) {
        onChange(name);
        handleModeChange();
      }
    }
  };

  return (
    <div className={classes.title}>
      {!editMode && (
        <>
          <Typography variant="h5" className={classes.projectName}>
            {projectName}
          </Typography>
          <IconButton
            onClick={handleModeChange}
            className={classes.editButton}
            size="small"
            title="Rename project"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      )}
      {editMode && (
        <TextField
          autoFocus
          classes={{ root: classes.input }}
          value={name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default RenameProjectBar;
