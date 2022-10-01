import React, { useEffect, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { matchSorter } from 'match-sorter';
import CircularProgress from '@mui/material/CircularProgress';
import * as Actions from '@Redux/permissions/actions';
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersNext,
  selectUsersSearchValue,
} from '@Redux/permissions/selectors';
import {
  Autocomplete,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Avatar from '@Components/UI/Avatar';
import { username } from '@Components/Sidebar/Board/User';
import { UserData } from '@Src/types';

type Props = {
  selected: UserData[];
  onChange(users: UserData[]): void;
};

const filterOptions = (options: UserData[], { inputValue }) =>
  matchSorter(options, inputValue, {
    keys: ['firstName', 'lastName', 'email', 'username'],
  });

const AllUsersList: React.FC<Props> = ({ onChange, selected }: Props) => {
  const dispatch = useDispatch();
  const usersListLoader = useSelector(selectUsersLoading);
  const hasNext = useSelector(selectUsersNext);
  const users = useSelector(selectAllUsers);
  const searchValue = useSelector(selectUsersSearchValue);

  const lastRowRef = useRef<HTMLTableRowElement>(null);
  const lastRowEl = lastRowRef && lastRowRef.current;

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
    400,
  );

  return (
    <Autocomplete
      multiple
      autoComplete
      includeInputInList
      filterSelectedOptions
      id="multiple-limit-tags"
      loading={usersListLoader}
      filterOptions={filterOptions}
      options={Object.values(users)}
      onChange={(_, value) => onChange(value)}
      value={selected}
      onInputChange={(_, newInputValue) => {
        if (handleSearchDelayedChange.pending()) {
          handleSearchDelayedChange.cancel();
        }
        handleSearchDelayedChange.callback(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          defaultValue={searchValue}
          variant="outlined"
          label="Invite by Email"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {usersListLoader ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) => {
        return value.map((user, index) => {
          return (
            <Chip
              avatar={
                <Avatar
                  alt={username(user)}
                  src={user.profile.avatar ?? undefined}
                  tooltipDisabled
                />
              }
              variant="outlined"
              label={username(user)}
              {...getTagProps({ index })}
            />
          );
        });
      }}
      renderOption={(props, user) => {
        return (
          <li {...props}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                alt={username(user)}
                src={user.profile.avatar ?? undefined}
                tooltipDisabled
              />
              <Stack>
                <Typography variant="subtitle1">{username(user)}</Typography>
                <Typography variant="subtitle2">{user.username}</Typography>
              </Stack>
            </Stack>
          </li>
        );
      }}
    />
  );
};

export default AllUsersList;
