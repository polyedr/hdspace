import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
// import { selectActiveElementId } from '@Redux/project/selectors/element';
// import { unbindGroupElementStyles } from '@Redux/project/actions';

type Props = {
  open: boolean;
  onClose: (...args: any) => any;
  onConfirm: (...args: any) => any;
};

const RemoveGroupBindingForm: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
}: Props) => {
  /* const dispatch = useDispatch();
  const activeElementId = useSelector(selectActiveElementId);

  const handleConfirm = useCallback(() => {}, []); */
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Change styles of a group element</DialogTitle>
      <DialogContent>
        By changing styles of a current element, you will not be able to change
        it again from the Master Screen. Proceed?
      </DialogContent>

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

export default RemoveGroupBindingForm;
