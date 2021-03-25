import React from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectProjectById } from '@Redux/project/selectors/base';
import UsersList from './UsersList';

type Props = {
  onClose: () => void;
  projectId: number | null;
};

const useStyles = makeStyles({
  dialog: {
    minWidth: 640,
    maxHeight: 480,
    minHeight: 400,
  },
});

const UserPermissionsModal: React.FC<Props> = ({
  onClose,
  projectId,
}: Props) => {
  const project = useSelector(selectProjectById(projectId || -1));
  const styles = useStyles();

  if (!project) {
    return null;
  }

  return (
    <Dialog open={projectId !== null} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{`${project.name}: manage user permissions`}</DialogTitle>
      <DialogContent className={styles.dialog}>
        {projectId && <UsersList projectId={projectId} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPermissionsModal;
