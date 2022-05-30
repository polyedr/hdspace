import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { updateNameAndTagsProject } from '@Redux/project/actions';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Box } from '@material-ui/core';
import Dialog from '../../../Dialogs/Dialog';
import Avatar from './Avatar';
import Logo from '../../../UI/Logo';
import TopbarTabs from './TopbarTabs';

const useStyles = makeStyles(() => ({
  toolbar: {
    backgroundColor: '#FFFFFF',
    color: '#000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 75,
    boxShadow:
      '0px 0px 1px rgba(55, 56, 60, 0.1), 0px 2px 4px rgba(55, 56, 60, 0.06)',
  },
}));

const TopPanel = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const {
    name: projectName,
    id,
    // user: { id: userIdCreator },
    tags,
  } = useSelector(selectCurrentProject);

  const handleClose = () => setOpenEdit(false);
  const handleSubmitNameAndTags = async (values) => {
    dispatch(updateNameAndTagsProject(id, values.name, values.tags));
    handleClose();
  };

  const tagsWithoutSpace = tags?.map((item, index) => {
    if (index === 0) return item;
    return ` ${item}`;
  });

  return (
    <AppBar position="fixed">
      <Toolbar variant="dense" className={classes.toolbar}>
        <Logo />

        <TopbarTabs />

        <Box style={{ display: 'flex' }}>
          <Avatar />
        </Box>
      </Toolbar>

      <Dialog
        open={openEdit}
        onSubmit={handleSubmitNameAndTags}
        onClose={handleClose}
        title="Rename or add tags for the project"
        fieldName="name"
        initialValueName={projectName}
        initialValueTags={tagsWithoutSpace}
        description={`Enter new name for project ${projectName}`}
      />
    </AppBar>
  );
};

export default TopPanel;
