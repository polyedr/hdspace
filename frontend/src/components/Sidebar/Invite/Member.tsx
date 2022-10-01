/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Switch, IconButton } from '@mui/material';
import Avatar from '@Components/UI/Avatar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ServerProject, UserData } from '@Src/types';
import { styled } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InputBase from '@mui/material/InputBase';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMore';

type PropsType = {
  project: ServerProject['id'];
  userData: UserData;
  permissions: Array<string>;
};

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    boxShadow: 'none',
    textTransform: 'capitalize',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  boxShadow: 'none',
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const BootstrapInput = styled(InputBase)(() => ({
  '& .MuiInputBase-input': {
    border: 0,
    borderRadius: 0,
    paddingLeft: 0,
    fontSize: 14,
    fontWeight: 400,
    paddingTop: '4px',
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
}));

const SelectMenuItem = styled(MenuItem)(() => ({
  '&.MuiMenuItem-root': {
    fontSize: 14,
    fontWeight: 400,
  },
}));

const Member: React.FC<PropsType> = ({ userData, permissions }) => {
  const { username, id } = userData;
  const rights = !!permissions.find((p: string) => p === 'change_project');
  const label = { inputProps: { 'aria-label': 'Switch' } };

  const [role, setRole] = React.useState(userData.profile.role.toLowerCase());

  const handleChange = (event: SelectChangeEvent<typeof role>) => {
    const {
      target: { value },
    } = event;
    setRole(value);
  };

  return (
    <StyledTableRow key={id}>
      <StyledTableCell
        component="td"
        scope="row"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Avatar
          src={userData.profile.avatar ?? undefined}
          alt={username}
          sx={{ marginRight: '10px' }}
        />
        {username}
      </StyledTableCell>
      <StyledTableCell style={{ textTransform: 'lowercase' }}>
        {userData.email}
      </StyledTableCell>
      <StyledTableCell>
        <Box sx={{ minWidth: 160 }}>
          <FormControl fullWidth size="small">
            <Select
              labelId="role-label"
              id="role-id"
              value={role}
              label="Role"
              onChange={handleChange}
              input={<BootstrapInput />}
              IconComponent={(props) => <ExpandMoreOutlinedIcon {...props} />}
            >
              <SelectMenuItem value="project manager">
                Project Manager
              </SelectMenuItem>
              <SelectMenuItem value="staff">Staff</SelectMenuItem>
              <SelectMenuItem value="developer">Developer</SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
      </StyledTableCell>
      <StyledTableCell>
        <Switch {...label} defaultChecked />
        {rights ? 'READ, WRITE' : 'READ'}
      </StyledTableCell>
      <StyledTableCell>
        <IconButton>
          <DeleteOutlineIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default Member;
