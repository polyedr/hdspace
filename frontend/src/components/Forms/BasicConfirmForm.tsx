import React from 'react';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
}: ConfirmFormProps) => {
  return (
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
};

export default BasicConfirmForm;
