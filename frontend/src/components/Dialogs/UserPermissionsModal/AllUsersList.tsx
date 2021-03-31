import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Actions from '@Redux/permissions/actions';
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersNext,
  selectUsersSearchValue,
} from '@Redux/permissions/selectors';
import Scrollbar from '@Components/UI/Scrollbar';
import PermissionsSelect from './PermissionsSelect';

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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

const AllUsersList: React.FC<Props> = ({ projectId }: Props) => {
  const dispatch = useDispatch();
  const usersListLoader = useSelector(selectUsersLoading);
  const hasNext = useSelector(selectUsersNext);
  const users = useSelector(selectAllUsers);
  const searchValue = useSelector(selectUsersSearchValue);

  const lastRowRef = useRef<HTMLTableRowElement>(null);
  const lastRowEl = lastRowRef && lastRowRef.current;

  const usersIds = useMemo(() => Object.keys(users), [users]);
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

      <Scrollbar autoHeightMax={200} autoHeightMin={200}>
        <Table>
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
            {usersIds.map((userId, index) => {
              const user = users[userId];
              return (
                <TableRow
                  key={userId}
                  ref={index === usersIds.length - 1 ? lastRowRef : null}
                >
                  <TableCell width="20%">{user.username}</TableCell>
                  <TableCell width="15%">{user.firstName}</TableCell>
                  <TableCell width="15%">{user.lastName}</TableCell>
                  <TableCell width="20%">{user.email}</TableCell>
                  <TableCell width="15%">{user.profile?.role}</TableCell>
                  <TableCell width="15%">
                    <PermissionsSelect projectId={projectId} userId={userId} />
                  </TableCell>
                </TableRow>
              );
            })}
            {usersListLoader && (
              <TableRow>
                <TableCell colSpan={6} className={classes.progress}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </div>
  );
};

export default AllUsersList;
