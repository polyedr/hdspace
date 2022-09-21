import { DialogTitle } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { MouseEvent } from 'react';

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
    <Dialog open={show} onClose={hide}>
      <DialogTitle>{actionText}</DialogTitle>
      <DialogContent>
        {`Are you sure you want to ${actionText} ${elementText}?`}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAction} type="submit">
          Yes
        </Button>
        <Button onClick={hide}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmModal.defaultProps = {
  actionText: '',
};

export default ConfirmModal;
