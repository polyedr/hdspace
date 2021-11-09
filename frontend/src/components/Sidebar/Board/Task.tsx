import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { ColumnData } from '@Src/types/pmtools/types';
import { requestDeleteTask } from '@Redux/pmtools/board/actions/tasks';
import { StyledIconButton } from '@Components/styledComponents';
import TaskModal from '@Components/Dialogs/PmToolsModal/TaskModal';
import { ModalAction, PermissionsUserData } from '@Src/types/types';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { Avatar, ListItem, ListItemText } from '@material-ui/core';
import { selectUserForCurrentTask } from '@Redux/permissions/selectors';

type Props = {
  column: ColumnData;
  task: any;
  members: Array<PermissionsUserData & { id: string }>;
};

const useStyles = makeStyles(({ palette, spacing }) => ({
  task: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: spacing(1),
    margin: spacing(0.2),
    borderRadius: 3,
    backgroundColor: palette.primary.light,
  },
  title: {
    margin: 0,
    maxWidth: '160px',
    wordWrap: 'break-word',
  },
  icon: {
    color: palette.grey[100],
  },
}));

const Task: React.FC<Props> = ({ column, task, members }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const currentMember = useSelector(selectUserForCurrentTask(task.owner));

  const handleDeleteTask = () => {
    const action = `Column "${task.title}" has been deleted`;
    dispatch(
      requestDeleteTask({
        action: {
          action,
          platform: 'PM-TOOLS',
          priority: 'medium',
        },
        taskId: task.id,
      }),
    );
  };

  return (
    <div className={classes.task}>
      <div>
        <h4 className={classes.title}>{task.name}</h4>
        {currentMember && (
          <ListItem style={{ padding: 0 }}>
            <div style={{ marginRight: 5 }}>
              <Avatar
                src={currentMember.userData.profile.avatar || ''}
                style={{ width: 30, height: 30 }}
              />
            </div>
            <ListItemText
              primary={currentMember.userData.username}
              secondary={currentMember.userData.profile.role}
              secondaryTypographyProps={{ style: { color: '#fff' } }}
              primaryTypographyProps={{ style: { fontSize: '14px' } }}
            />
          </ListItem>
        )}
      </div>
      <div>
        <StyledIconButton
          size="small"
          title="Edit task"
          onClick={() => setShowTaskModal(true)}
        >
          <EditIcon fontSize="small" className={classes.icon} />
        </StyledIconButton>
        <StyledIconButton
          size="small"
          title="Delete task"
          onClick={() => setShowConfirmModal(true)}
        >
          <DeleteIcon fontSize="small" className={classes.icon} />
        </StyledIconButton>
      </div>

      <TaskModal
        show={showTaskModal}
        hide={() => setShowTaskModal(false)}
        task={task}
        column={column}
        selectedTaskId={task.id}
        action={ModalAction.Edit}
        members={members}
      />
      <ConfirmModal
        show={showConfirmModal}
        elementText="task"
        action={handleDeleteTask}
        hide={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default Task;
