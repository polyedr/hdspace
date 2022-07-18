import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { updateNameAndTagsProject } from '@Redux/project/actions';
import { AppBar, Toolbar, Box } from '@mui/material';
import styled from 'styled-components';
import Dialog from '../../../Dialogs/Dialog';
import Avatar from './Avatar';
import Logo from '../../../UI/Logo';
import TopbarTabs from './TopbarTabs';

const CustomeToolBar = styled(Toolbar)`
  background-color: #ffffff;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 75px;
  box-shadow: rgba(55, 56, 60, 0.06);
  & .MuiToolbar-root.MuiToolbar-dense:hover {
    box-shadow: rgba(55, 56, 60, 0.1);
  }
`;
const TopPanel = () => {
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);
  const { name: projectName, id, tags } = useSelector(selectCurrentProject);

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
      <CustomeToolBar variant="dense">
        <Logo />
        <TopbarTabs />
        <Box style={{ display: 'flex' }}>
          <Avatar />
        </Box>
      </CustomeToolBar>

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
