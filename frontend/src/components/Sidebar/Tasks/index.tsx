import React, { FC, useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { Container } from '@material-ui/core';
import { SideBarTitle } from '@Components/styledComponents';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectColumnListWithTasks,
  // selectLoaderBoard,
} from '@Redux/pmtools/board/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestFetchBoard } from '@Redux/pmtools/board/actions/columns';
import { ModalAction } from '@Src/types/types';
import ColumnModal from '@Components/Dialogs/PmToolsModal/Tasks/ColumnModal';
import { selectTokenPair } from '@Redux/user/selectors';
import Columns from './Columns';

const TasksTab: FC = () => {
  const dispatch = useDispatch();
  const columnList = useSelector(selectColumnListWithTasks);
  const projectId = useSelector(selectCurrentProjectId);
  const { access } = useSelector(selectTokenPair);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(requestFetchBoard({ projectId, access }));
  }, [access, dispatch, projectId]);

  const titleActions = [
    {
      callback: () => setOpen(true),
      icon: AddCircleOutlineIcon,
      title: 'Create task group',
    },
  ];

  return (
    <Container>
      <SideBarTitle
        title="Latest tasks"
        icon={FormatListBulletedIcon}
        actions={titleActions}
      />
      {!columnList.length ? (
        <p>Create you first column</p>
      ) : (
        columnList.map((item) => <Columns key={item.id} column={item} />)
      )}
      <ColumnModal
        show={open}
        hide={() => setOpen(false)}
        action={ModalAction.Create}
      />
    </Container>
  );
};

export default TasksTab;
