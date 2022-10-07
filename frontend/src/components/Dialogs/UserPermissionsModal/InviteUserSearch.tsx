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
  Chip as MuiChip,
  Stack,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from '@mui/material';
import Avatar from '@Components/UI/Avatar';
import { username } from '@Components/Sidebar/Board/User';
import { styled } from '@mui/material/styles';
import { UserData } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';

const InputTitle = styled('p')({
  marginTop: 0,
  marginBottom: 10,
});

const TextField = styled(MuiTextField)({
  '& label.Mui-focused': {
    color: '#81818E',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E4E6EB !important',
    },
    '&:hover fieldset': {
      borderColor: 'var(--blue)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E4E6EB',
    },
  },
});

const Chip = styled(MuiChip)({
  background: '#F3F4F6',
  borderColor: 'transparent',
  height: '24px',

  '& .MuiChip-avatar': {
    color: 'white',
    marginLeft: 0,
  },
});

const TypographyTitle = styled(MuiTypography)({
  fontSize: 14,
});

const TypographySubTitle = styled(MuiTypography)({
  fontSize: 14,
  color: '#81818E',
  fontWeight: 400,
});

const useStyles = makeStyles({
  option: {
    '&::-webkit-scrollbar': {
      width: '4px !important',
      background: '#F3F4F6',
    },

    '&::-webkit-scrollbar-thumb': {
      background: '#B0B0BD',
      borderRadius: 4,
    },

    '&::-webkit-scrollbar-track': {
      borderRadius: 4,
    },
  },
});

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

  const classes = useStyles();

  return (
    <>
      <InputTitle>Invite by email address</InputTitle>
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
        classes={{
          listbox: classes.option,
        }}
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
            size="small"
            placeholder="Email"
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
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  alt={username(user)}
                  src={user.profile.avatar ?? undefined}
                  tooltipDisabled
                  sx={{ height: 36, width: 36 }}
                />
                <Stack>
                  <TypographyTitle variant="subtitle1">
                    {username(user)}
                  </TypographyTitle>
                  <TypographySubTitle variant="subtitle2">
                    {user.username}
                  </TypographySubTitle>
                </Stack>
              </Stack>
            </li>
          );
        }}
      />
    </>
  );
};

export default AllUsersList;
