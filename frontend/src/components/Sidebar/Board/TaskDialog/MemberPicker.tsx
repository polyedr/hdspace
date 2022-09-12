import React, { useCallback, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  Theme,
  useTheme,
  styled,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { IconButton } from './StyledComponents';
import { username } from '../User';

const FormWrapper = styled('div')({
  padding: 20,
});

const FormTitle = styled('p')({
  margin: 0,
  fontWeight: 500,
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

const MemberPicker = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const [person, setPerson] = React.useState<string>('');

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

  const handleChange = (event: SelectChangeEvent<typeof person>) => {
    const {
      target: { value },
    } = event;

    setPerson(value);
  };

  const users = useMemo(() => {
    return Object.values(members).map(({ userData }) => ({
      id: userData.id,
      name: username(userData),
      avatar: userData.profile.avatar ?? undefined,
    }));
  }, [members]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <AddIcon />
      </IconButton>
      <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}>
        <FormWrapper>
          <FormTitle>Add Member</FormTitle>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              value={person}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => {
                const user = users.find((u) => u.id === parseInt(selected))!;

                return (
                  <Stack direction="row" spacing={2}>
                    <ListItemIcon>
                      <Avatar
                        src={user.avatar || undefined}
                        sx={{ width: 24, height: 24 }}
                        alt={user.name}
                      />
                    </ListItemIcon>
                    <ListItemText>{user.name}</ListItemText>
                  </Stack>
                );
              }}
              MenuProps={MenuProps}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <ListItemIcon>
                    <Avatar
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
        </FormWrapper>
      </Popover>
    </>
  );
};

export default MemberPicker;
