import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectByIdWrapper } from '@Redux/project/selectors/base';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import { Checkbox, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UserData } from '@Src/types';
import InviteUserSearch from './InviteUserSearch';

type Props = {
  onClose: () => void;
  projectId: number | null;
};

const UserPermissionsModal: React.FC<Props> = ({
  onClose,
  projectId,
}: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [writePermission, setWritePermission] = useState<boolean>(false);

  const project = useSelector(selectProjectByIdWrapper(projectId || -1));

  const handleChangeWritePermission = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWritePermission(e.target.checked);
    },
    [setWritePermission],
  );

  if (!project) {
    return null;
  }

  return (
    <Dialog maxWidth="sm" open={projectId !== null} onClose={onClose}>
      <DialogTitle>
        Invite People
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ minWidth: 600 }}>
        <InviteUserSearch
          selected={selectedUsers}
          onChange={setSelectedUsers}
        />
        <br />
        <Typography>Every user will be able to</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={writePermission}
              onChange={handleChangeWritePermission}
            />
          }
          label="Change Project"
          labelPlacement="end"
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPermissionsModal;
