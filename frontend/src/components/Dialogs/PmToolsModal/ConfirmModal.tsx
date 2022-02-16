import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
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
      <DialogContent>
        <form>
          <h2>Confirm</h2>
          <p>{`Are you sure you want to ${actionText} ${elementText}?`}</p>
          <DialogActions>
            <Button
              onClick={handleAction}
              type="submit"
              variant="contained"
              color="secondary"
            >
              Yes
            </Button>
            <Button onClick={hide} variant="contained" color="primary">
              No
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

ConfirmModal.defaultProps = {
  actionText: '',
};

export default ConfirmModal;
