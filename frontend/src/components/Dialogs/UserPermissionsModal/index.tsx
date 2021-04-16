import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectProjectById } from '@Redux/project/selectors/base';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';
import AllUsersList from './AllUsersList';
import ProjectUsersList from './ProjectUsersList';

type Props = {
  onClose: () => void;
  projectId: number | null;
};

const useStyles = makeStyles({
  dialog: {
    minWidth: 640,
    minHeight: 500,
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
      <DialogTitle>{`${project.name}: manage users' permissions`}</DialogTitle>
      <DialogContent className={styles.dialog}>
        {projectId && (
          <>
            <ProjectUsersList projectId={projectId} />
            <AllUsersList projectId={projectId} />
          </>
        )}
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
