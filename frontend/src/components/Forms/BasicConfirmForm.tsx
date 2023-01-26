import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

type ConfirmFormProps = React.PropsWithChildren<any> & {
  open: boolean;
  title: string;
  onClose: (...args: any) => any;
  onConfirm: (...args: any) => any;
};

const BasicConfirmForm: React.FC<ConfirmFormProps> = ({
  open,
  title,
  onClose,
  onConfirm,
  children,
}: ConfirmFormProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>

    <DialogActions>
      <Button variant="contained" color="primary" onClick={onClose}>
        Cancel
      </Button>

      <Button variant="contained" color="secondary" onClick={onConfirm}>
        Change
      </Button>
    </DialogActions>
  </Dialog>
);

export default BasicConfirmForm;
