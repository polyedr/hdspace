import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { canElementHaveChildren } from '$utils/AvailableChildrenHelper';
import {
  selectActiveItem,
  selectCurrentScreenId,
  selectItemToCopyInfo,
} from '$redux/project/selectors';
import {
  copyActiveItem,
  deleteItem,
  pasteCopiedItem,
  setIsAddElementsModalOpened,
} from '$redux/project/actions';
import Icon from '$components/UI/Icon';

const StyledMenu = withStyles({
  paper: {
    borderRadius: 0,
    backgroundColor: '#2f4050',
    color: 'white',
  },
  list: {
    padding: 0,
    '& li': {
      padding: '2px 5px',
      fontSize: '.9em',
      '&:hover': {
        backgroundColor: '#52616e',
      },
      '& svg': {
        // fill: 'white',
        marginRight: 5,
      },
    },
  },
})((props: MenuProps) => <Menu {...props} />);

type Props = {
  open: boolean;
  onClose: () => void;
  anchorPosition: any;
};

const ContextMenu: React.FC<Props> = ({ open, onClose, anchorPosition }) => {
  const dispatch = useDispatch();
  const { itemType: activeItemType, itemId: activeItemId } = useSelector(
    selectActiveItem,
  );
  const emptyClipboard = !useSelector(selectItemToCopyInfo);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const canHaveChildren = canElementHaveChildren(activeItemType);

  const handleDelete = () => {
    if (!activeItemId) return;
    dispatch(deleteItem(activeItemId, { screenId: currentScreenId }));
    onClose();
  };

  const handleAddNew = () => {
    dispatch(setIsAddElementsModalOpened(true));
    onClose();
  };

  const handleCopy = () => {
    dispatch(copyActiveItem());
    onClose();
  };

  const handlePaste = () => {
    dispatch(pasteCopiedItem({ screenId: currentScreenId }));
    onClose();
  };

  return (
    <StyledMenu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuItem disabled={!canHaveChildren} onClick={handleAddNew}>
        <Icon icon="add" size={16} color="white" />
        Add new...
      </MenuItem>

      <MenuItem disabled={activeItemType === 'root'} onClick={handleCopy}>
        <Icon icon="copy" size={16} color="white" />
        Copy
      </MenuItem>

      <MenuItem
        disabled={!canHaveChildren || emptyClipboard}
        onClick={handlePaste}
      >
        <Icon icon="folder-open" size={16} color="white" />
        Paste
      </MenuItem>

      <MenuItem disabled={activeItemType === 'root'} onClick={handleDelete}>
        <Icon icon="delete" size={16} color="white" />
        Delete
      </MenuItem>
    </StyledMenu>
  );
};

export default ContextMenu;
