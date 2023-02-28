import React from 'react';
import { withStyles } from '@mui/styles';
import { MenuProps } from '@mui/material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { TreeItem } from '@atlaskit/tree';
import { Menu, MenuItem } from '@mui/material';
import {
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
  setActiveElement,
} from '@Redux/project/actions';
import { canElementHaveChildren } from '@Utils/AvailableChildrenHelper';
import { selectItemToCopyInfo } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import Icon from '../../../UI/Icon';

const StyledMenu = withStyles({
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
})((props: MenuProps) => <Menu {...props} />);

interface Props {
  open: boolean;
  onClose: () => void;
  anchorPosition: any;
  item: TreeItem;
}

const ContextMenu: React.FC<Props> = ({
  open,
  onClose,
  anchorPosition,
  item,
}) => {
  const dispatch = useDispatch();
  const {
    data: { type },
    id,
  } = item;
  const emptyClipboard = !useSelector(selectItemToCopyInfo);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const canHaveChildren = canElementHaveChildren(type);

  const handleDelete = () => {
    if (!id) return;
    dispatch(deleteElement(id.toString(), { screenId: currentScreenId }));
    onClose();
  };

  const handleCopy = () => {
    dispatch(copyActiveElement());
    onClose();
  };

  const handlePaste = () => {
    dispatch(setActiveElement(String(item.id)));
    dispatch(pasteCopiedElement({ screenId: currentScreenId }));
    onClose();
  };

  return (
    <StyledMenu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuItem disabled={type === 'root'} onClick={handleCopy}>
        <Icon icon="copy" size={16} color="black" />
        Copy
      </MenuItem>

      <MenuItem
        disabled={!canHaveChildren || emptyClipboard}
        onClick={handlePaste}
      >
        <Icon icon="folder-open" size={16} color="black" />
        Paste
      </MenuItem>

      <MenuItem disabled={type === 'root'} onClick={handleDelete}>
        <Icon icon="delete" size={16} color="black" />
        Delete
      </MenuItem>
    </StyledMenu>
  );
};

export default ContextMenu;
