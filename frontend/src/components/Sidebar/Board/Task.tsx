import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { requestDeleteTask } from '@Redux/pmtools/board/actions/tasks';
import { StyledIconButton } from '@Components/styledComponents';
import TaskModal from '@Components/Dialogs/PmToolsModal/TaskModal';
import { ModalAction, PermissionsUserData } from '@Src/types/types';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { IColumnData } from '@Src/types/pmtools/trelloTypes';

type Props = {
  column: IColumnData;
  task: any;
  index: number;
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

const Task: React.FC<Props> = ({ column, task, members, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleDeleteTask = () => {
    const action = `Column "${task.name}" has been deleted`;
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
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            key={task.id}
            className={classes.task}
          >
            <div>
              <h4 className={classes.title}>{task.name}</h4>
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
      }}
    </Draggable>
  );
};

export default Task;
