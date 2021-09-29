import React, { useState } from 'react';
import { IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IColumn } from '@Src/pm-types/board/types';
import { IMember } from '@Src/pm-types/invite/types';
import { StyledIconButton } from '@Components/styledComponents';
import { ModalAction } from '@Src/types';
import TaskModal from '@Components/Dialogs/PmToolsModal/Tasks/TaskModal';
import Task from './Task';

const useStyles = makeStyles(({ palette }) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '250px',
  },
  title: {
    maxWidth: '250px',
    wordWrap: 'break-word',
  },
  icon: {
    color: palette.common.white,
  },
}));

type Props = {
  tasksModal: boolean;
  column: IColumn;
  members: Array<IMember>;
  setTasksModal: (v: boolean) => void;
  setConfirmModal: (v: boolean) => void;
  setColumnModal: (v: boolean) => void;
};

export const Column = ({
  column,
  tasksModal,
  members,
  setTasksModal,
  setConfirmModal,
  setColumnModal,
}: any) => {
  const classes = useStyles();
  const [showTasks, setShowTasks] = useState(false);

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        {column.title}
      </Typography>

      <div className={classes.buttonContainer}>
        <div>
          {column.tasks.length ? (
            <>
              <span>{`${column.tasks.length} tasks`}</span>
              <IconButton
                title="Show tasks"
                onClick={() => setShowTasks(!showTasks)}
                size="small"
              >
                {showTasks ? (
                  <ExpandLessIcon fontSize="small" className={classes.icon} />
                ) : (
                  <ExpandMoreIcon fontSize="small" className={classes.icon} />
                )}
              </IconButton>
            </>
          ) : (
            <span>No tasks</span>
          )}
        </div>
        <div>
          <StyledIconButton
            size="small"
            title="Create task"
            onClick={() => setTasksModal(true)}
          >
            <AddIcon fontSize="small" />
          </StyledIconButton>
          <StyledIconButton
            size="small"
            title="Edit column"
            onClick={() => setColumnModal(true)}
          >
            <EditIcon fontSize="small" />
          </StyledIconButton>
          <StyledIconButton
            size="small"
            title="Delete column"
            onClick={() => setConfirmModal(true)}
          >
            <DeleteIcon fontSize="small" />
          </StyledIconButton>
        </div>
      </div>

      {showTasks &&
        column.tasks.map((task: any) => (
          <Task members={members} column={column} task={task} key={task.id} />
        ))}

      <TaskModal
        show={tasksModal}
        hide={() => setTasksModal(!tasksModal)}
        column={column}
        action={ModalAction.Create}
        members={members}
      />
    </>
  );
};

export default Column;
