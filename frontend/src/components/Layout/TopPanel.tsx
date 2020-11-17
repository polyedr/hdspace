import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Avatar from './Avatar';
import { selectCurrentProject } from '../../redux/project/selectors';
import Dialog from '../Dialogs/Dialog';
import { renameProject } from '../../redux/project/actions';
import TopBar from '../Editor/TopBar';

const useStyles = makeStyles({
  toolbar: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
  },
  title: {
    padding: '0.5em 1em',
    '&:hover $editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },
  editButton: {
    opacity: 0,
    transition: 'opacity 0.1s ease',
  },
});

const TopPanel = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);

  const { name: projectName, id } = useSelector(selectCurrentProject);

  const handleEditClick = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);
  const handleSubmitRename = async (values) => {
    dispatch(renameProject(id, values.name));
    handleClose();
  };

  return (
    <AppBar position="fixed">
      <Toolbar variant="dense" className={classes.toolbar}>
        <Avatar />

        {projectName && (
          <div className={classes.title}>
            <Typography variant="h6">{projectName}</Typography>

            <IconButton
              onClick={handleEditClick}
              className={classes.editButton}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        <TopBar />
      </Toolbar>

      <Dialog
        open={openEdit}
        onSubmit={handleSubmitRename}
        onClose={handleClose}
        title="Rename Project"
        fieldName="name"
        initialValue={projectName}
        description={`Enter new name for project ${projectName}`}
      />
    </AppBar>
  );
};

export default TopPanel;
