/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Droppable } from 'react-beautiful-dnd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StyledIconButton } from '@Components/styledComponents';
import { ModalAction } from '@Src/types/types';
import TaskModal from '@Components/Dialogs/PmToolsModal/TaskModal';
import { IColumnData } from '@Src/types/pmtools/trelloTypes';
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
  column: IColumnData;
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

  if (!column) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.root}>
      <p>{column.name}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      <Droppable droppableId={column.id} key={column.id}>
        {(provided) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <p>You have {column.tasks.length} tasks</p>

              {showTasks &&
                column.tasks.map((task: any, i: number) => (
                  <Task index={i} column={column} task={task} key={task.id} />
                ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>

      <TaskModal
        show={tasksModal}
        hide={() => setTasksModal(!tasksModal)}
        column={column}
        action={ModalAction.Create}
      />
    </div>
  );
};

export default Column;
