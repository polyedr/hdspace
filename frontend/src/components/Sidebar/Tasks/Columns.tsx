import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestDeleteColumn } from '@Redux/pmtools/board/actions/columns';
import { ModalAction } from '@Src/types/types';
import ColumnModal from '@Components/Dialogs/PmToolsModal/Tasks/ColumnModal';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { selectMembers } from '@Redux/pmtools/invite/selectors';
import { selectTokenPair } from '@Redux/user/selectors';
import { Column } from './Column';

const useStyles = makeStyles(({ palette, spacing, shadows, shape }) => ({
  card: {
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: shape.borderRadius,
    boxShadow: shadows[5],
    margin: spacing(1, 0),
    padding: spacing(1),
  },
}));

const Columns: FC<any> = ({ column }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const members = useSelector(selectMembers);
  const projectId = useSelector(selectCurrentProjectId);
  const [columnModal, setColumnModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [tasksModal, setTasksModal] = useState(false);
  const { access } = useSelector(selectTokenPair);

  const handleDeleteColumn = () => {
    const action = `Column "${column.title}" has been deleted`;
    dispatch(
      requestDeleteColumn({ columnId: column.id, projectId, action, access }),
    );
  };

  return (
    <div className={classes.card}>
      <Column
        setConfirmModal={setConfirmModal}
        setColumnModal={setColumnModal}
        setTasksModal={setTasksModal}
        tasksModal={tasksModal}
        members={members}
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
        elementText="Column"
        action={handleDeleteColumn}
      />
    </div>
  );
};

export default Columns;
