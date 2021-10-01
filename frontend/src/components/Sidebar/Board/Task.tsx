import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ColumnData, MemberData, TaskData } from '@Src/types/pmtools/types';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestDeleteTask } from '@Redux/pmtools/board/actions/tasks';
import { StyledIconButton } from '@Components/styledComponents';
import TaskModal from '@Components/Dialogs/PmToolsModal/Tasks/TaskModal';
import { ModalAction } from '@Src/types/types';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { selectTokenPair } from '@Redux/user/selectors';

type Props = {
  column: ColumnData;
  task: TaskData;
  members: Array<MemberData>;
};

const useStyles = makeStyles(({ palette, spacing }) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  task: {
    padding: spacing(1),
    margin: spacing(1),
    borderRadius: 4,
  },
  title: {
    margin: '5px 0',
    maxWidth: '250px',
    wordWrap: 'break-word',
  },
  icon: {
    color: palette.grey[100],
  },
}));

const Task: React.FC<Props> = ({ column, task, members }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { access } = useSelector(selectTokenPair);

  const currentMember = members.find(
    (m: MemberData) => m.user_id === task.owner,
  );

  const handleDeleteTask = () => {
    const action = `Column "${task.title}" has been deleted`;
    dispatch(requestDeleteTask({ access, action, taskId: task.id, project }));
  };

  return (
    <div className={classes.task}>
      <h4 className={classes.title}>{task.title}</h4>
      <div className={classes.buttonContainer}>
        {currentMember && (
          <ListItem style={{ padding: 0 }}>
            <div style={{ marginRight: 5 }}>
              <Avatar
                src={currentMember.user.profile.avatar || ''}
                style={{ width: 30, height: 30 }}
              />
            </div>
            <ListItemText
              primary={currentMember.user.username}
              secondary={currentMember.role}
              secondaryTypographyProps={{ style: { color: '#fff' } }}
              primaryTypographyProps={{ style: { fontSize: '14px' } }}
            />
          </ListItem>
        )}
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
      </div>

      <TaskModal
        members={members}
        show={showTaskModal}
        hide={() => setShowTaskModal(false)}
        task={task}
        column={column}
        selectedTaskId={task.id}
        action={ModalAction.Edit}
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
