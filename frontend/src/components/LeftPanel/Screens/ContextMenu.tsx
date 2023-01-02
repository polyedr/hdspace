import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { duplicateScreen } from '@Redux/project/actions';
import { selectScreensLength } from '@Redux/project/selectors/screen';
import { Menu, MenuItem, styled } from '@mui/material';
import { Screen } from '@Src/types';
import Icon from '../../UI/Icon';

const StyledMenu = styled(Menu)({
  paper: {
    padding: 1,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    color: '#81818E',
  },
  list: {
    padding: 0,
    '& li': {
      padding: '8px 16px 8px 16px',
      fontSize: '.9em',
      '&:hover': {
        backgroundColor: '#B0B0BD',
        color: '#2A2A2D',
      },
      '& svg': {
        marginRight: 5,
      },
    },
  },
});

type Props = {
  screen: Screen;
  open: boolean;
  onClose: () => void;
  openEdit: () => void;
  openDelete: () => void;
  anchorPosition: any;
};

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
    <StyledMenu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuItem onClick={handleRenameClick}>
        <Icon icon="edit" size={16} color="black" />
        Edit
      </MenuItem>

      <MenuItem onClick={handleCopy}>
        <Icon icon="copy" size={16} color="black" />
        Copy
      </MenuItem>

      <MenuItem onClick={handleDelete} disabled={!canDelete}>
        <Icon icon="delete" size={16} color="black" />
        Delete
      </MenuItem>
    </StyledMenu>
  );
};

export default ContextMenu;
