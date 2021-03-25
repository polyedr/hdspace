import React, { useEffect, useCallback, useState } from 'react';
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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
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

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [
    selectedUserPermission,
    setSelectedUserPermission,
  ] = useState<UserProjectPermission | null>(null);

  const classes = useStyles();

  useEffect(() => {
    dispatch(Actions.getUsersList());
  }, [dispatch]);

  const handleChangePermissions = useCallback(() => {
    if (!selectedUserId) {
      console.error('No selected user');
      return;
    }
    if (!selectedUserPermission) {
      console.error('No selected user permission value');
      return;
    }
    dispatch(
      Actions.assignUserPermissionsForProject(
        projectId,
        selectedUserId,
        selectedUserPermission,
      ),
    );
    setSelectedUserId(null);
  }, [dispatch, selectedUserPermission, projectId, selectedUserId]);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(users).map((userId) => {
              const user = users[userId];
              return (
                <TableRow
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                >
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profile?.role}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Dialog open={!!selectedUserId} onClose={() => setSelectedUserId(null)}>
        <DialogTitle>Edit user permissions</DialogTitle>
        <DialogContent>
          <Select
            defaultValue={UserProjectPermission.UNSET}
            onChange={(e: React.ChangeEvent<any>) => {
              setSelectedUserPermission(
                (e.target as HTMLInputElement).value as UserProjectPermission,
              );
            }}
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
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedUserId(null)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={handleChangePermissions}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersList;
