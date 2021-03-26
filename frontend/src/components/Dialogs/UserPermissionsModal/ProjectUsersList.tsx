import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import * as Actions from '@Redux/permissions/actions';

type Props = {
  projectId: number;
};

const ProjectUsersList: React.FC<Props> = ({ projectId }: Props) => {
  // const projectUsers = useSelector(select);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.getAllUsersProjectPermissions(projectId));
  });

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width="25%">User name</TableCell>
            <TableCell width="15%">First name</TableCell>
            <TableCell width="20%">Last name</TableCell>
            <TableCell width="25%">Email</TableCell>
            <TableCell width="15%">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell width="25%">123</TableCell>
            <TableCell width="15%">123</TableCell>
            <TableCell width="20%">123</TableCell>
            <TableCell width="25%">123</TableCell>
            <TableCell width="15%">123</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectUsersList;
