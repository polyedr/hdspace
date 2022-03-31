import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { requestDeleteColumn } from '@Redux/pmtools/board/actions/columns';
import { ModalAction } from '@Src/types';
import ColumnModal from '@Components/Dialogs/PmToolsModal/ColumnModal';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import Classnames from 'classnames';
import { Column } from './Column';
import { IColumnData } from '@Src/types/pmtools/board';

type ColumnsProps = {
  column: IColumnData,
  index: number,
} 

type ColumnsProps = {
  column: any,
  index: number,
} 

const useStyles = makeStyles(({ spacing, shadows, shape, palette }) => ({
  card: {
    borderRadius: shape.borderRadius,
    boxShadow: shadows[5],
    margin: spacing(1, 0),
  },
  dragging: {
    backgroundColor: palette.primary.light,
  },
}));

const Columns: FC<ColumnsProps> = ({ column, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [columnModal, setColumnModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [tasksModal, setTasksModal] = useState(false);

  const handleDeleteColumn = () => {
    const action = `Column "${column.name}" has been deleted`;
    dispatch(
      requestDeleteColumn({
        columnId: column.id,
        action: { action, priority: 'medium', platform: 'PM-TOOLS' },
      }),
    );
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className={Classnames(classes.card, {
                [classes.dragging]: snapshot.isDragging,
              })}
            >
              <Column
                setConfirmModal={setConfirmModal}
                setColumnModal={setColumnModal}
                setTasksModal={setTasksModal}
                tasksModal={tasksModal}
                column={column}
              />
              <ColumnModal
                show={columnModal}
                column={column}
                hide={() => setColumnModal(false)}
                action={ModalAction.Edit}
              />
              <ConfirmModal
                show={confirmModal}
                hide={() => setConfirmModal(false)}
                elementText="column"
                actionText="delete"
                action={handleDeleteColumn}
              />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Columns;
