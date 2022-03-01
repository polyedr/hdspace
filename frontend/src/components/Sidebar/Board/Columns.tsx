import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { requestDeleteColumn } from '@Redux/pmtools/board/actions/columns';
import { ModalAction } from '@Src/types';
import ColumnModal from '@Components/Dialogs/PmToolsModal/ColumnModal';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { Column } from './Column';

const useStyles = makeStyles(({ spacing, shadows, shape }) => ({
  card: {
    borderRadius: shape.borderRadius,
    boxShadow: shadows[5],
    margin: spacing(1, 0),
  },
}));

const Columns: FC<any> = ({ column }) => {
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
    <div className={classes.card}>
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
        action={handleDeleteColumn}
      />
    </div>
  );
};

export default Columns;
