import React, { useCallback, useMemo, useState } from 'react';
import {
  Stack,
  TextField as MuiTextField,
  styled,
  InputAdornment,
  List,
  Button as MuiButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { useDispatch, useSelector } from 'react-redux';
import {
  requestCreateChecklistItem,
  requestDeleteChecklist,
} from '@Redux/pmtools/board/actions/checklist';
import { BoardTask } from '@Redux/pmtools/types';
import { selectChecklist } from '@Redux/pmtools/board/selectors';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import ProgressBar from './ProgressBar';
import CheckItem from './CheckItem';
import { IconButton } from '../StyledComponents';

const TextField = styled(MuiTextField)({
  '& input': {
    padding: '6.5px 14px',
  },
});

const StyledIconButton = styled(IconButton)({
  backgroundColor: 'transparent !important',
  height: 'auto',
  width: 'auto',
  marginLeft: 'auto',
});

const RemoveButton = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  boxShadow: 'none',
  fontSize: 12,
  textTransform: 'capitalize',
  color: '#81818E',

  '&:hover': {
    boxShadow: 'none',
  },
});

const InfoTitle = styled('span')({
  color: '#81818E',
  fontSize: 12,
  fontWeight: 500,
  margin: '16px 0',
});

interface Props {
  task: BoardTask;
}

const Checklist = ({ task }: Props) => {
  const [addingItem, setAddingItem] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();

  const checklist = useSelector(selectChecklist(task));

  const [value, setValue] = useState('');

  const handleSetAddingItem = useCallback((adding: boolean) => {
    return () => setAddingItem(adding);
  }, []);

  const handleDeleteChecklist = useCallback(() => {
    dispatch(requestDeleteChecklist(task));
  }, [task]);

  const handleCancelDeleteRequest = useCallback(() => {
    setConfirmDelete(false);
  }, []);

  const handleRequestDelete = useCallback(() => {
    setConfirmDelete(true);
  }, []);

  const handleAddItem = useCallback(() => {
    dispatch(requestCreateChecklistItem(value.trim(), task));
    setAddingItem(false);
    setValue('');
  }, [value, task, setAddingItem]);

  const handleEnterAddItem = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (value) handleAddItem();
      }
    },
    [value, task, setAddingItem, handleAddItem],
  );

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const progress = useMemo(() => {
    return (
      (checklist.filter((c) => c.status === 1).length * 100) / checklist.length
    );
  }, [checklist]);

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <InfoTitle>Checklist</InfoTitle>
          <IconButton onClick={handleSetAddingItem(true)}>
            <AddIcon />
          </IconButton>
        </Stack>
        {checklist.length > 0 && (
          <>
            <ProgressBar progress={progress} />
            <RemoveButton
              onClick={handleRequestDelete}
              variant="contained"
              color="inherit"
              size="small"
            >
              Remove
            </RemoveButton>
          </>
        )}
      </Stack>
      {!addingItem || (
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Add Item"
            fullWidth
            onKeyDown={handleEnterAddItem}
            onChange={handleChangeValue}
            value={value}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <StyledIconButton edge="end">
                    <AlternateEmailIcon />
                  </StyledIconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <StyledIconButton
              disabled={value.trim().length < 1}
              onClick={handleAddItem}
            >
              <CheckIcon />
            </StyledIconButton>
            <StyledIconButton onClick={handleSetAddingItem(false)}>
              <CloseIcon />
            </StyledIconButton>
          </Stack>
        </Stack>
      )}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {checklist.map((item) => (
          <CheckItem task={task} item={item} key={item.id.toString()} />
        ))}
      </List>
      <ConfirmModal
        show={confirmDelete}
        action={handleDeleteChecklist}
        elementText="checklist"
        actionText="Delete"
        hide={handleCancelDeleteRequest}
      />
    </div>
  );
};

export default React.memo(Checklist);
