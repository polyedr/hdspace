import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  styled,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createScreenFolder } from '@Redux/project/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';

const StyledIconButton = styled(IconButton)({
  width: '32px',
  height: '32px',
  color: '#81818e',

  '& svg': {
    height: 20,
  },
});

const ScreenFolder = () => {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const projectId = useSelector(selectCurrentProjectId);

  const dispatch = useDispatch();

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    dispatch(createScreenFolder(name, projectId));
    handleClose();
  }, [projectId, name, handleClose]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Screen Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the folder you want to create and use to group the
            screens.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
            value={name}
            onChange={handleChangeName}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="text" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <StyledIconButton
        title="Create Screen"
        size="small"
        onClick={handleClickOpen}
      >
        <FolderIcon />
      </StyledIconButton>
    </>
  );
};

export default ScreenFolder;
