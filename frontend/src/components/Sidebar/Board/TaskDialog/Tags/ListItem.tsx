import {
  Checkbox,
  IconButton,
  ListItem as MuiListItem,
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material';
import { BoardLabel } from '@Redux/pmtools/types';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useCallback, useState } from 'react';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';

const ListItemIcon = styled(MuiListItemIcon)({
  padding: 0,
  minWidth: 'auto',
});

const ListItemButton = styled(MuiListItemButton)({
  padding: 0,

  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const ListItemText = styled(MuiListItemText)<{ color: string }>(
  ({ color }) => ({
    borderRadius: 16,
    padding: '4px 8px',
    display: 'inline-block',
    flex: 'none',
    background: color,

    '& span': {
      fontSize: 12,
      color: 'white',
    },
  }),
);

interface Props {
  label: BoardLabel;
  selected: boolean;
  onToggle(id: number): void;
  onDelete(id: number): void;
}

const ListItem = ({ label, selected, onToggle, onDelete }: Props) => {
  const [showDelete, setShowDelete] = useState(false);

  const handleShowDelete = useCallback((show: boolean) => {
    return () => setShowDelete(show);
  }, []);

  const labelId = `checkbox-list-label-${label.id}`;

  return (
    <>
      <MuiListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleShowDelete(true)}
          >
            <DeleteIcon />
          </IconButton>
        }
        key={label.id.toString()}
        disablePadding
        disableGutters
      >
        <ListItemButton
          role={undefined}
          dense
          onClick={() => onToggle(label.id)}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={selected}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText
            color={label.colour}
            id={labelId}
            primary={label.text}
          />
        </ListItemButton>
      </MuiListItem>
      <ConfirmModal
        show={showDelete}
        elementText="Label"
        actionText="Delete"
        action={() => onDelete(label.id)}
        hide={handleShowDelete(false)}
      />
    </>
  );
};

export default ListItem;
