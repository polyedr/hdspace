import React, { useCallback, useState } from 'react';
import {
  Box,
  Checkbox as MuiCheckbox,
  IconButton as MuiIconButton,
  InputAdornment,
  ListItem,
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText,
  Stack,
  styled,
  TextField as MuiTextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { ClickAwayListener } from '@material-ui/core';
import { BoardTask, BoardTaskCheckListItem } from '@Redux/pmtools/types';
import { useDispatch } from 'react-redux';
import {
  requestDeleteChecklistItem,
  requestUpdateChecklistItem,
} from '@Redux/pmtools/board/actions/checklist';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';

const ListItemInput = styled(ListItem)({
  padding: 0,
});

const ListItemTitle = styled(ListItem)({
  padding: 0,
  '&:hover': {
    '& .MuiListItemSecondaryAction-root': {
      display: 'block',
    },
  },

  '& .MuiListItemSecondaryAction-root': {
    display: 'none',
    transform: 'none',
    top: '5px',
    right: 0,
  },
});

const ListItemButton = styled(MuiListItemButton)({
  padding: '10px 80px 10px 0 !important',
  borderRadius: 4,

  '&:hover': {
    background: 'none',
  },
});

const ListItemIcon = styled(MuiListItemIcon)({
  minWidth: 'auto',
});

const Checkbox = styled(MuiCheckbox)({
  color: '#E4E6EB',
  padding: 0,
  marginRight: 5,
  marginLeft: '-2px',
});

const TextField = styled(MuiTextField)({
  width: '80%',
  '& input': {
    padding: '6.5px 14px',
  },

  '& fieldset': {
    borderColor: '#E4E6EB !important',
  },
});

const IconButton = styled(MuiIconButton)({
  '& svg': {
    color: '#81818E',
    fontSize: 18,
  },
});

interface Props {
  item: BoardTaskCheckListItem;
  task: BoardTask;
}

const CheckItem = ({ item, task }: Props) => {
  const [value, setValue] = useState(item.text);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, showConfirmDelete] = useState(false);

  const dispatch = useDispatch();

  const handleToggle = useCallback(() => {
    dispatch(
      requestUpdateChecklistItem(
        { id: item.id, status: item.status === 0 ? 1 : 0 },
        task,
      ),
    );
  }, [item, task]);

  const handleSetEditing = useCallback((editing: boolean) => {
    return () => setEditing(editing);
  }, []);

  const handleSave = useCallback(() => {
    setEditing(false);
    dispatch(
      requestUpdateChecklistItem({ id: item.id, text: value.trim() }, task),
    );
  }, [dispatch, item, value, task]);

  const handleDelete = useCallback(() => {
    dispatch(requestDeleteChecklistItem(item.id, task));
  }, [dispatch, item, value, task]);

  const handleRequestDelete = useCallback(() => {
    showConfirmDelete(true);
  }, [showConfirmDelete]);

  const handleCancelDelete = useCallback(() => {
    showConfirmDelete(false);
  }, [showConfirmDelete]);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const handleSaveOnEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSave();
      }
    },
    [handleSave],
  );

  const labelId = `checkbox-list-label-${item.id}`;

  return (
    <>
      {editing ? (
        <ClickAwayListener onClickAway={handleSetEditing(false)}>
          <ListItemInput
            secondaryAction={
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  disabled={value.trim().length < 1}
                  onClick={handleSave}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={handleSetEditing(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            }
            disablePadding
          >
            <Box
              role={undefined}
              px={0.5}
              width="100%"
              display="flex"
              alignItems="center"
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={item.status === 1}
                  tabIndex={-1}
                  disabled={editing}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <TextField
                variant="outlined"
                placeholder="Add Item"
                onKeyDown={handleSaveOnEnter}
                onChange={handleChangeValue}
                value={value}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <AlternateEmailIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </ListItemInput>
        </ClickAwayListener>
      ) : (
        <ListItemTitle
          secondaryAction={
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton onClick={handleSetEditing(true)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleRequestDelete}>
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
          }
          disablePadding
        >
          <ListItemButton
            alignItems="flex-start"
            role={undefined}
            onClick={handleToggle}
            dense
          >
            <ListItemIcon style={{ margin: 0 }}>
              <Checkbox
                edge="start"
                checked={item.status === 1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText style={{ marginTop: 0 }}>{item.text}</ListItemText>
          </ListItemButton>
        </ListItemTitle>
      )}

      <ConfirmModal
        action={handleDelete}
        elementText="checklist item"
        hide={handleCancelDelete}
        show={confirmDelete}
        actionText="Delete"
      />
    </>
  );
};

export default CheckItem;
