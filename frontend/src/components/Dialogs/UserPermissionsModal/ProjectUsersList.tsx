import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import * as Actions from '@Redux/permissions/actions';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import Scrollbar from '@Components/UI/Scrollbar';
import { makeStyles, Typography } from '@material-ui/core';
import PermissionsSelect from './PermissionsSelect';

type Props = {
  projectId: number;
};

const useStyles = makeStyles({
  root: {
    height: '200px',
  },
  title: {
    textAlign: 'center',
  },
});

const ProjectUsersList: React.FC<Props> = ({ projectId }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectUsers = useSelector(selectAllUsersPermissions);

  useEffect(() => {
    dispatch(Actions.getAllUsersProjectPermissions(projectId));
  }, [dispatch, projectId]);

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Project users
      </Typography>
      <Scrollbar autoHeightMax={165}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="20%">User name</TableCell>
                <TableCell width="15%">First name</TableCell>
                <TableCell width="15%">Last name</TableCell>
                <TableCell width="20%">Email</TableCell>
                <TableCell width="15%">Role</TableCell>
                <TableCell width="15%">Permissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(projectUsers).map((userId) => {
                const { userData } = projectUsers[userId];
                return (
                  <TableRow key={`project-user-${userId}`}>
                    <TableCell width="20%">{userData.username}</TableCell>
                    <TableCell width="15%">{userData.firstName}</TableCell>
                    <TableCell width="15%">{userData.lastName}</TableCell>
                    <TableCell width="20%">{userData.email}</TableCell>
                    <TableCell width="15%">{userData.profile?.role}</TableCell>
                    <TableCell width="15%">
                      <PermissionsSelect
                        projectId={projectId}
                        userId={userId}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default ProjectUsersList;
