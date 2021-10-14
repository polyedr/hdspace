import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ColumnData } from '@Src/types/pmtools/types';
import { StyledIconButton } from '@Components/styledComponents';
import { ModalAction } from '@Src/types/types';
import TaskModal from '@Components/Dialogs/PmToolsModal/TaskModal';
import { useSelector } from 'react-redux';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import Task from './Task';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: 'grid',
    padding: 10,
  },
  title: {
    maxWidth: '230px',
    wordWrap: 'break-word',
  },
  icon: {
    color: palette.common.white,
  },
}));

type Props = {
  tasksModal: boolean;
  column: ColumnData;
  setTasksModal: (v: boolean) => void;
  setConfirmModal: (v: boolean) => void;
  setColumnModal: (v: boolean) => void;
};

export const Column: React.FC<Props> = ({
  column,
  tasksModal,
  setTasksModal,
  setConfirmModal,
  setColumnModal,
}: any) => {
  const classes = useStyles();
  const [showTasks, setShowTasks] = useState(false);
  const membersData = useSelector(selectAllUsersPermissions);
  const members = Object.values(membersData);

  return (
    <div className={classes.root}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>
          {column.tasks.length
            ? `You have ${column.tasks.length} tasks`
            : 'Create first task'}
        </p>
        <div>
          {column.tasks.length ? (
            <StyledIconButton
              title="Show tasks"
              onClick={() => setShowTasks(!showTasks)}
              size="small"
            >
              {showTasks ? (
                <ExpandLessIcon fontSize="small" className={classes.icon} />
              ) : (
                <ExpandMoreIcon fontSize="small" className={classes.icon} />
              )}
            </StyledIconButton>
          ) : null}
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
      <div>
        <Typography variant="h6" className={classes.title}>
          {column.title}
        </Typography>
        <Typography variant="subtitle2" className={classes.title}>
          {column.description}
        </Typography>
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
    </div>
  );
};

export default Column;
