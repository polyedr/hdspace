/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  Avatar,
  Switch,
} from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ServerProject } from '@Src/types';
import { styled } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InputBase from '@mui/material/InputBase';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMore';

type PropsType = {
  project: ServerProject['id'];
  userData: any;
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
  const { username, id, profile } = userData;
  const rights = !!permissions.find((p: string) => p === 'change_project');
  const label = { inputProps: { 'aria-label': 'Switch' } };

  const [role, setRole] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof role>) => {
    const {
      target: { value },
    } = event;
    setRole(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
    <>
      {/* <ListItem button key={id} style={{ padding: 0 }}>
        <ListItemAvatar>
          <Avatar
            src={
              typeof profile.parameters.avatarCrop === 'string'
                ? profile.parameters.avatarCrop
                : ''
            }
            alt={username}
            sx={{ bgcolor: '#344AF0' }}
          >
            {username[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={profile.role}
          secondary={username}
          secondaryTypographyProps={{ style: { color: '#fff' } }}
          primaryTypographyProps={{ style: { fontSize: '14px' } }}
        />
        <p style={{ fontSize: 10 }}>{rights ? 'READ, WRITE' : 'READ'}</p>
      </ListItem> */}

      <StyledTableRow key={id}>
        <StyledTableCell
          component="td"
          scope="row"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Avatar
            src={
              typeof profile.parameters.avatarCrop === 'string'
                ? profile.parameters.avatarCrop
                : ''
            }
            alt={username}
            sx={{ bgcolor: '#344AF0', marginRight: '10px' }}
          >
            {username[0].toUpperCase()}
          </Avatar>
          {username}
        </StyledTableCell>
        <StyledTableCell style={{ textTransform: 'lowercase' }}>
          alexandra.sayapina@alignedcode.com
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
                multiple
                IconComponent={(props) => <ExpandMoreOutlinedIcon {...props} />}
              >
                <SelectMenuItem value="Project Manager">
                  Project Manager
                </SelectMenuItem>
                <SelectMenuItem value="Staff">Staff</SelectMenuItem>
                <SelectMenuItem value="Developer">Developer</SelectMenuItem>
              </Select>
            </FormControl>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Switch {...label} defaultChecked />
          {rights ? 'READ, WRITE' : 'READ'}
        </StyledTableCell>
        <StyledTableCell>
          <DeleteOutlineIcon />
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default Member;
