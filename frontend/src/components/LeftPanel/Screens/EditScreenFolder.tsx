import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { ScreenFolder } from '@Redux/types';

interface Props {
  open: boolean;
  folder: ScreenFolder;
  onRequestClose: () => void;
}

const EditScreenFolder: React.FC<Props> = ({
  open,
  folder,
  onRequestClose,
}) => {
  const [name, setName] = useState(folder.name);

  const handleSubmit = useCallback(() => {}, []);

  const handleChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [],
  );

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle>Screen Folder</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the name of the folder and hit submit to update.
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
        <Button variant="text" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          disabled={name.trim().length < 1}
          variant="text"
          onClick={handleSubmit}
        >
          Udate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditScreenFolder;
