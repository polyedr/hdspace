import React, { FC, useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import {
  StyledAccordionSummary,
  StyledIconButton,
} from '@Components/styledComponents';
import { useDispatch, useSelector } from 'react-redux';
import { selectColumnListWithTasks } from '@Redux/pmtools/board/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  requestFetchBoard,
  requestUpdateColumnIndex,
} from '@Redux/pmtools/board/actions/columns';
import { ModalAction } from '@Src/types';
import ColumnModal from '@Components/Dialogs/PmToolsModal/ColumnModal';
import { requestUpdateCardIndex } from '@Redux/pmtools/board/actions/tasks';
import Columns from './Columns';

const TasksTab: FC = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const columns = useSelector(selectColumnListWithTasks);
  const project = useSelector(selectCurrentProjectId);

  const onDragEnd = async ({ destination, source, type }: DropResult) => {
    if (!destination) return;
    if (type === 'boards') {
      dispatch(requestUpdateColumnIndex({ destination, source }));
    } else {
      dispatch(requestUpdateCardIndex({ destination, source }));
    }
  };

  useEffect(() => {
    dispatch(requestFetchBoard(project));
  }, [dispatch, project]);

  return (
    <div style={{ padding: '10px 30px' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <StyledAccordionSummary
          expandIcon={
            <StyledIconButton
              size="small"
              title="Add column"
              onClick={() => setOpen(true)}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </StyledIconButton>
          }
        >
          Board
        </StyledAccordionSummary>

        {!columns.length ? (
          <p>Create you first column</p>
        ) : (
          <Droppable droppableId="board-droppable" type="boards">
            {(provided) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {columns.map((item, index: number) => (
                    <Columns key={item.id} column={item} index={index} />
                  ))}
                </div>
              );
            }}
          </Droppable>
        )}
        <ColumnModal
          show={open}
          hide={() => setOpen(false)}
          action={ModalAction.Create}
        />
      </DragDropContext>
    </div>
  );
};

export default TasksTab;
