import React, { useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
// import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Actions from '@Redux/permissions/actions';
import {
  selectUsersForProject,
  selectUsersLoading,
  /* selectUsersNext, */
  selectUsersSearchValue,
} from '@Redux/permissions/selectors';
import { UserProjectPermission } from '@Src/types';

type Props = {
  projectId: number;
};

const useStyles = makeStyles({
  searchSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progress: {
    minHeight: 390,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const UsersList: React.FC<Props> = ({ projectId }: Props) => {
  const dispatch = useDispatch();
  const usersListLoader = useSelector(selectUsersLoading);
  // const hasNext = useSelector(selectUsersNext);
  const users = useSelector(selectUsersForProject);
  const searchValue = useSelector(selectUsersSearchValue);

  const classes = useStyles();

  useEffect(() => {
    dispatch(Actions.getUsersList());
  }, [dispatch]);

  const handleChangePermissions = (
    permission: UserProjectPermission,
    userId: string,
  ) => {
    dispatch(
      Actions.assignUserPermissionsForProject(projectId, userId, permission),
    );
  };

  const handleSearchChange = useCallback(
    (search: string) => {
      dispatch(Actions.getUsersList(search));
    },
    [dispatch],
  );

  const handleSearchDelayedChange = useDebouncedCallback(
    handleSearchChange,
    750,
  );

  return (
    <div>
      <div className={classes.searchSection}>
        <TextField
          defaultValue={searchValue}
          onChange={(
            e: React.KeyboardEvent<HTMLInputElement> &
              React.ChangeEvent<HTMLInputElement>,
          ) => {
            if (e.key === 'Enter') {
              handleSearchChange((e.target as HTMLInputElement).value);
            } else {
              if (handleSearchDelayedChange.pending()) {
                handleSearchDelayedChange.cancel();
              }
              handleSearchDelayedChange.callback(
                (e.target as HTMLInputElement).value,
              );
            }
          }}
          label="Search users"
          variant="outlined"
          margin="dense"
          placeholder="Search users"
        />
      </div>

      {usersListLoader && (
        <div className={classes.progress}>
          <CircularProgress size={24} />
        </div>
      )}

      {!usersListLoader && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User name</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Assign permissions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(users).map((userId) => {
              const user = users[userId];
              return (
                <TableRow key={userId}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profile?.role}</TableCell>
                  <TableCell>
                    <div>
                      <Select
                        onChange={(e) =>
                          handleChangePermissions(
                            e.target?.value as UserProjectPermission,
                            userId,
                          )
                        }
                        value={UserProjectPermission.UNSET}
                      >
                        {Object.keys(UserProjectPermission).map((key) => {
                          return (
                            <MenuItem
                              key={`permission-${key}`}
                              value={UserProjectPermission[key]}
                            >
                              {key.replace('_', ' ')}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UsersList;
