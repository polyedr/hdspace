import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjectByIdWrapper } from '@Redux/project/selectors/base';
import {
  Dialog as MuiDialog,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  DialogActions as MuiDialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Checkbox,
  FormControlLabel as MuiFormControlLabel,
  IconButton,
} from '@mui/material';
import * as Actions from '@Redux/permissions/actions';
import CloseIcon from '@mui/icons-material/Close';
import { UserData, UserProjectPermission } from '@Src/types';
import { styled } from '@mui/material/styles';
import InviteUserSearch from './InviteUserSearch';

const Dialog = styled(MuiDialog)({
  '& .MuiPaper-root': {
    borderRadius: 6,
  },
});

const DialogTitle = styled(MuiDialogTitle)({
  padding: '16px 20px 5px',
  '& .MuiTypography-h6': {
    fontSize: 18,
  },
});

const DialogContent = styled(MuiDialogContent)({
  padding: '8px 20px',
});

const FormControlLabel = styled(MuiFormControlLabel)({
  '& .css-ahj2mt-MuiTypography-root': {
    fontSize: 14,
  },
});

const DialogActions = styled(MuiDialogActions)({
  padding: '0 20px 24px',
});

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
  const dispatch = useDispatch();

  const project = useSelector(selectProjectByIdWrapper(projectId || -1));

  const handleChangeWritePermission = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWritePermission(e.target.checked);
    },
    [setWritePermission],
  );

  const handleSend = useCallback(() => {
    if (projectId) {
      dispatch(
        Actions.updateUsersPermissionsForProject(
          projectId,
          selectedUsers,
          writePermission
            ? [
                UserProjectPermission.CHANGE_PROJECT,
                UserProjectPermission.VIEW_PROJECT,
              ]
            : [UserProjectPermission.VIEW_PROJECT],
        ),
      );

      onClose();
    }
  }, [selectedUsers, projectId, writePermission, onClose]);

  if (!project) {
    return null;
  }

  return (
    <Dialog maxWidth="xs" open={projectId !== null} onClose={onClose}>
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
      <DialogContent style={{ minWidth: 420 }}>
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
              size="small"
            />
          }
          label="Change Project"
          labelPlacement="end"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSend} color="primary" variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPermissionsModal;
