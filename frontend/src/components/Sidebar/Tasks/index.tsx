import React, { FC, useState } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { Container } from '@material-ui/core';
import { SideBarTitle } from '@Components/styledComponents';
import Columns from './Columns';

const TasksTab: FC = () => {
  // const dispatch = useDispatch();
  // const columnList = useSelector(selectColumnListWithTasks);
  // const projectId = useSelector(selectProjectId);
  // const loader = useSelector(selectLoaderBoard);

  const [, setOpen] = useState(false);
  const columnList = [];

  // useEffect(() => {
  //   dispatch(requestFetchBoard(projectId));
  // }, [dispatch]);

  const titleActions = [
    {
      callback: () => setOpen(true),
      icon: AddCircleOutlineIcon,
      title: 'Create task group',
    },
  ];

  // if (loader) {
  //   return (
  //     <Container>
  //       <p>Loading... </p>
  //     </Container>
  //   );
  // }

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
        columnList.map((item) => <Columns column={item} />)
      )}
      {/* <ColumnModal
        show={open}
        hide={() => setOpen(false)}
        action={ModalAction.Create}
      /> */}
    </Container>
  );
};

export default TasksTab;
