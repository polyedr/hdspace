import React, { FC, useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { Container } from '@material-ui/core';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { SideBarTitle } from '@Components/styledComponents';
import { useDispatch, useSelector } from 'react-redux';
import { selectColumnListWithTasks } from '@Redux/pmtools/board/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestFetchBoard } from '@Redux/pmtools/board/actions/columns';
import { ModalAction } from '@Src/types/types';
import ColumnModal from '@Components/Dialogs/PmToolsModal/ColumnModal';
import { requestUpdateCardIndex } from '@Redux/pmtools/board/actions/tasks';
import Columns from './Columns';

const TasksTab: FC = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const columns = useSelector(selectColumnListWithTasks);
  const project = useSelector(selectCurrentProjectId);

  const onDragEnd = async ({ destination, source }: DropResult) => {
    if (!destination) return;
    dispatch(requestUpdateCardIndex({ destination, source }));
  };

  useEffect(() => {
    dispatch(requestFetchBoard(project));
  }, [dispatch, project]);

  const titleActions = [
    {
      callback: () => setOpen(true),
      icon: AddCircleOutlineIcon,
      title: 'Create task group',
    },
  ];

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <Container>
        <SideBarTitle
          title="Latest tasks"
          icon={FormatListBulletedIcon}
          actions={titleActions}
        />
        {!columns.length ? (
          <p>Create you first column</p>
        ) : (
          columns.map((item) => <Columns key={item.id} column={item} />)
        )}
        <ColumnModal
          show={open}
          hide={() => setOpen(false)}
          action={ModalAction.Create}
        />
      </Container>
    </DragDropContext>
  );
};

export default TasksTab;
