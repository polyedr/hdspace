import React from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { selectProjectById } from '@Redux/project/selectors/base';
import UsersList from './UsersList';

type Props = {
  onClose: () => void;
  projectId: number | null;
};

const UserPermissionsModal: React.FC<Props> = ({
  onClose,
  projectId,
}: Props) => {
  const project = useSelector(selectProjectById(projectId || -1));

  if (!project) {
    return null;
  }

  return (
    <Dialog open={projectId !== null} onClose={onClose}>
      <DialogTitle>Manage user permissions</DialogTitle>
      <DialogContent>
        <Paper>
          <div>
            <span>{`Project: ${project.name}`}</span>
          </div>
          {projectId && <UsersList projectId={projectId} />}
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsModal;
