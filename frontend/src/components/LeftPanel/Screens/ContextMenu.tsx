import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem } from '@mui/material';
import { CopyAll, Delete, Edit } from '@mui/icons-material';
import { duplicateScreen } from '@Redux/project/actions';
import { selectScreensLength } from '@Redux/project/selectors/screen';
import { Screen } from '@Src/types';
import { ContextMenu as StyledContextMenu } from '@Components/styledComponents';

interface Props {
  screen: Screen;
  open: boolean;
  onClose: () => void;
  openEdit: () => void;
  openDelete: () => void;
  anchorPosition: any;
}

const ContextMenu: React.FC<Props> = ({
  screen,
  open,
  onClose,
  openEdit,
  openDelete,
  anchorPosition,
}) => {
  const { id, name } = screen;
  const dispatch = useDispatch();
  const screensNumber = useSelector(selectScreensLength);
  const canDelete = screensNumber > 2;

  const handleDelete = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openDelete();
    onClose();
  };
  const handleCopy = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(duplicateScreen(name, id));
    onClose();
  };
  const handleRenameClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    openEdit();
  };

  return (
    <StyledContextMenu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuItem onClick={handleRenameClick}>
        <Edit />
        Edit
      </MenuItem>

      <MenuItem onClick={handleCopy}>
        <CopyAll />
        Copy
      </MenuItem>

      <MenuItem onClick={handleDelete} disabled={!canDelete}>
        <Delete />
        Delete
      </MenuItem>
    </StyledContextMenu>
  );
};

export default ContextMenu;
