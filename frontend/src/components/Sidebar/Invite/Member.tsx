/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Switch, IconButton } from '@mui/material';
import Avatar from '@Components/UI/Avatar';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ServerProject, UserData } from '@Src/types';
import { styled } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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

const Member: React.FC<PropsType> = ({ userData, permissions }) => {
  const { username, id } = userData;
  const rights = !!permissions.find((p: string) => p === 'change_project');
  const label = { inputProps: { 'aria-label': 'Switch' } };

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
      <StyledTableCell>{userData.profile.role}</StyledTableCell>
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
