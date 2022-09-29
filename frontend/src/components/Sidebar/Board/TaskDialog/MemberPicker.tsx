import React, { useCallback, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Avatar as MuiAvatar,
  FormControl as MuiFormControl,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  MenuItem,
  OutlinedInput,
  Popover as MuiPopover,
  Select,
  SelectChangeEvent,
  Stack as MuiStack,
  styled,
  Button as MuiButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import Avatar from '@Components/UI/Avatar';
import { IconButton } from './StyledComponents';
import User, { username } from '../User';

const Popover = styled(MuiPopover)({
  boxShadow:
    '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08)',
});

const FormWrapper = styled('div')({
  padding: 20,
});

const FormTitle = styled('p')({
  margin: 0,
  fontWeight: 500,
});

const FormControl = styled(MuiFormControl)({
  margin: '15px 0 0',
  '& .MuiSelect-select': {
    padding: '6.5px 14px',
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
});

const ListStack = styled(MuiStack)({
  backgroundColor: '#F3F4F6',
  borderRadius: 16,
  minHeight: 24,
});

const ListItemIcon = styled(MuiListItemIcon)({
  minWidth: 'auto !important',
});

const ListItemText = styled(MuiListItemText)({
  // paddingRight: 10,
  marginLeft: 0,

  '& span': {
    whiteSpace: 'nowrap',
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12,
    padding: '0 10px',
  },
});

const Button = styled(MuiButton)({
  textTransform: 'capitalize',

  '&.MuiButton-text': {
    color: '#81818E',
  },

  '&.MuiButton-contained': {
    backgroundColor: 'var(--blue)',
  },
});

const AuthorAvatar = styled(Avatar)({
  width: 24,
  height: 24,
  fontSize: 14,
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface User {
  id: number;
  name: string;
  avatar?: string;
}

interface Props {
  selected?: string;
  onChange(member: User | null): void;
}

const MemberPicker = ({ selected, onChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const [person, setPerson] = React.useState<string>(selected ?? '-1');

  const members = useSelector(selectAllUsersPermissions);

  const open = Boolean(anchorEl);
  const id = open ? 'due-date-popover' : undefined;

  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const users = useMemo(() => {
    return Object.values(members).map(({ userData }) => ({
      id: userData.id,
      name: username(userData),
      avatar: userData.profile.avatar ?? undefined,
    }));
  }, [members]);

  const handleChange = useCallback(
    (event: SelectChangeEvent<typeof person>) => {
      const {
        target: { value },
      } = event;
      setPerson(value);
    },
    [setPerson],
  );

  const selectedUser = users.find((u) => u.id === parseInt(selected ?? '0'));

  const handleSubmit = useCallback(() => {
    const user = users.find((u) => u.id === parseInt(person));
    onChange(user ?? null);
    handleClose();
  }, [users, person, onChange]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        {selectedUser ? (
          <AuthorAvatar
            uniqueKey={selectedUser.id}
            alt={selectedUser.name}
            src={selectedUser.avatar}
          />
        ) : (
          <AddIcon />
        )}
      </IconButton>

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <FormWrapper>
          <FormTitle>Add Member</FormTitle>
          <FormControl sx={{ width: 300 }}>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              value={person}
              onChange={handleChange}
              size="small"
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => {
                const user = users.find((u) => u.id === parseInt(selected))!;

                if (user) {
                  return (
                    <ListStack
                      direction="row"
                      spacing={0}
                      display="inline-flex"
                      alignItems="center"
                    >
                      <ListItemIcon>
                        <MuiAvatar
                          src={user.avatar || undefined}
                          sx={{ width: 24, height: 24 }}
                          alt={user.name}
                        />
                      </ListItemIcon>
                      <ListItemText>{user.name}</ListItemText>
                    </ListStack>
                  );
                }
                return (
                  <ListStack
                    direction="row"
                    spacing={1}
                    display="inline-flex"
                    alignItems="center"
                  >
                    <ListItemText>Unassigned</ListItemText>
                  </ListStack>
                );
              }}
              MenuProps={MenuProps}
            >
              <MenuItem key="unassigned" value={-1}>
                <ListItemText>Unassigned</ListItemText>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <ListItemIcon>
                    <MuiAvatar
                      src={user.avatar || undefined}
                      sx={{ width: 24, height: 24 }}
                      alt={user.name}
                    />
                  </ListItemIcon>
                  <ListItemText>{user.name}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <MuiStack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            mt={2}
          >
            <Button onClick={handleClose} variant="text">
              Cancel
            </Button>
            <Button
              disabled={!person}
              onClick={handleSubmit}
              variant="contained"
            >
              Add
            </Button>
          </MuiStack>
        </FormWrapper>
      </Popover>
    </>
  );
};

export default MemberPicker;
