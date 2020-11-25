import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectCurrentScreenId,
  selectItemToCopyInfo,
} from '../../../../redux/project/selectors';
import {
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
} from '../../../../redux/project/actions';
import { canElementHaveChildren } from '../../../../utils/AvailableChildrenHelper';
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
};

const ContextMenu: React.FC<Props> = ({ open, onClose, anchorPosition }) => {
  const dispatch = useDispatch();
  const { type: activeElementType, id: activeElementId } = useSelector(
    selectActiveElement,
  );
  const emptyClipboard = !useSelector(selectItemToCopyInfo);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const canHaveChildren = canElementHaveChildren(activeElementType);

  const handleDelete = () => {
    if (!activeElementId) return;
    dispatch(deleteElement(activeElementId, { screenId: currentScreenId }));
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
      <MenuItem disabled={activeElementType === 'root'} onClick={handleCopy}>
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

      <MenuItem disabled={activeElementType === 'root'} onClick={handleDelete}>
        <Icon icon="delete" size={16} color="white" />
        Delete
      </MenuItem>
    </StyledMenu>
  );
};

export default ContextMenu;
