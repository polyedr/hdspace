// import { DialogTitle } from '@material-ui/core';
import {
  Button as MuiButton,
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Stack,
  styled,
} from '@mui/material';
import React, { MouseEvent } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const Dialog = styled(MuiDialog)({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 420,
  },
});

const DialogTitle = styled(MuiDialogTitle)({
  fontSize: 18,
  fontWeight: 600,
  padding: 0,
  lineHeight: 2,
});

const DialogActions = styled(MuiDialogActions)({
  padding: '0 24px 20px',
});

const Button = styled(MuiButton)({
  textTransform: 'capitalize',

  '&.MuiButton-text': {
    color: '#81818E',
  },

  '&.MuiButton-contained': {
    backgroundColor: 'var(--blue)',
  },
});

type Props = {
  show: boolean;
  hide: () => void;
  elementText: string;
  action: () => void;
  actionText?: string;
};

const ConfirmModal: React.FC<Props> = ({
  show,
  hide,
  elementText,
  action,
  actionText,
}) => {
  const handleAction = (e: MouseEvent) => {
    e.preventDefault();
    action();
    hide();
  };

  return (
    <Dialog open={show} onClose={hide} maxWidth="md">
      <Stack direction="row" justifyContent="space-between" p={2} pl={3} pb={0}>
        <DialogTitle>{actionText}</DialogTitle>
        <IconButton aria-label="close" onClick={hide} size="small">
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        {`Are you sure you want to ${actionText} ${elementText}?`}
      </DialogContent>
      <DialogActions>
        <Button onClick={hide} variant="text">
          No
        </Button>
        <Button onClick={handleAction} type="submit" variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmModal.defaultProps = {
  actionText: '',
};

export default ConfirmModal;
