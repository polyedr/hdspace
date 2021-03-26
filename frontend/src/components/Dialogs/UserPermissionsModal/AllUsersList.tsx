import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useMemo,
} from 'react';
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
  selectUsersNext,
  selectUsersSearchValue,
} from '@Redux/permissions/selectors';
import { UserProjectPermission } from '@Src/types';
import { EDITABLE_USER_PERMISSIONS } from '@Constants/defaultParams';

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

const AllUsersList: React.FC<Props> = ({ projectId }: Props) => {
  const dispatch = useDispatch();
  const usersListLoader = useSelector(selectUsersLoading);
  const hasNext = useSelector(selectUsersNext);
  const users = useSelector(selectUsersForProject);
  const searchValue = useSelector(selectUsersSearchValue);

  const lastRowRef = useRef<HTMLTableRowElement>(null);
  const lastRowEl = lastRowRef && lastRowRef.current;

  const usersIds = useMemo(() => Object.keys(users), [users]);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [
    selectedUserPermission,
    setSelectedUserPermission,
  ] = useState<UserProjectPermission | null>(null);

  const classes = useStyles();

  useEffect(() => {
    dispatch(Actions.getUsersList());
  }, [dispatch]);

  const handleGetUsersList = useCallback(() => {
    if (hasNext) {
      dispatch(Actions.getUsersList());
    }
  }, [dispatch, hasNext]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleGetUsersList();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.01,
      },
    );

    if (lastRowEl) {
      obs.observe(lastRowEl);
    }

    return () => {
      if (lastRowEl) {
        obs.unobserve(lastRowEl);
      }
    };
  }, [handleGetUsersList, lastRowEl]);

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
              <TableCell width="25%">User name</TableCell>
              <TableCell width="15%">First name</TableCell>
              <TableCell width="20%">Last name</TableCell>
              <TableCell width="25%">Email</TableCell>
              <TableCell width="15%">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersIds.map((userId, index) => {
              const user = users[userId];
              return (
                <TableRow
                  key={userId}
                  onClick={() => setSelectedUserId(parseInt(userId))}
                  ref={index === usersIds.length - 1 ? lastRowRef : null}
                >
                  <TableCell width="25%">{user.username}</TableCell>
                  <TableCell width="15%">{user.firstName}</TableCell>
                  <TableCell width="20%">{user.lastName}</TableCell>
                  <TableCell width="25%">{user.email}</TableCell>
                  <TableCell width="15%">{user.profile?.role}</TableCell>
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
            onChange={(e: React.ChangeEvent<any>) => {
              setSelectedUserPermission(
                (e.target as HTMLInputElement).value as UserProjectPermission,
              );
            }}
          >
            {EDITABLE_USER_PERMISSIONS.map((key) => {
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

export default AllUsersList;
