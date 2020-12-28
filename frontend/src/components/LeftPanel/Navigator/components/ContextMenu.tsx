import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
} from '@Redux/project/actions';
import { canElementHaveChildren } from '@Utils/AvailableChildrenHelper';
import { selectItemToCopyInfo } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { TreeItem } from '@atlaskit/tree';
import Icon from '../../../UI/Icon';

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
        marginRight: 5,
      },
    },
  },
})((props: MenuProps) => <Menu {...props} />);

type Props = {
  open: boolean;
  onClose: () => void;
  anchorPosition: any;
  item: TreeItem;
};

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

      <MenuItem disabled={type === 'root'} onClick={handleDelete}>
        <Icon icon="delete" size={16} color="white" />
        Delete
      </MenuItem>
    </StyledMenu>
  );
};

export default ContextMenu;
