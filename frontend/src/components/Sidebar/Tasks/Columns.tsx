import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
  // const dispatch = useDispatch();
  // const members = useSelector(selectMembers);
  // const projectId = useSelector(selectProjectId);
  const [, setColumnModal] = useState(false);
  const [, setConfirmModal] = useState(false);
  const [tasksModal, setTasksModal] = useState(false);
  const members = [];

  // const handleDeleteColumn = () => {
  //   const action = `Column "${column.title}" has been deleted`;
  //   dispatch(requestDeleteColumn({ columnId: column.id, projectId, action }));
  // };

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
      {/* <ColumnModal
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
      /> */}
    </div>
  );
};

export default Columns;
