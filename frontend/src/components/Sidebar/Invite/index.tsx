import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import {
  PanelTextField,
  StyledAccordionSummary,
  StyledIconButton,
} from '@Components/styledComponents';
import GroupIcon from '@material-ui/icons/Group';
import * as Actions from '@Redux/permissions/actions';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestSendEmail } from '@Redux/pmtools/invite/actions';
import { Container } from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@mui/icons-material/Search';
import Member from './Member';

const useStyles = makeStyles({
  search: {
    position: 'relative',
    '& svg': {
      position: 'absolute',
      top: '50%',
      left: '10px',
      transform: 'translateY(-50%)',
      color: '#E4E6EB',
    },
  },
  searchField: {
    marginTop: '0 !important',
    '& input': {
      paddingLeft: '40px',
    },
    '& .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
      {
        borderColor: '#E4E6EB',
      },
  },
});

const ProjectMembers: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const members = useSelector(selectAllUsersPermissions);
  const projectId = useSelector(selectCurrentProjectId);
  const [permissionsManagementProjectId, setPermissionsManagementProjectId] =
    useState<number | null>(null);

  const handleEmail = (e: FormEvent) => {
    e.preventDefault();
    dispatch(requestSendEmail(email));
  };

  useEffect(() => {
    dispatch(Actions.getAllUsersProjectPermissions(projectId));
  }, [dispatch, projectId]);

  const StyledTable = styled(Table)(() => ({
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
  }));

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      color: '#81818E',
      fontSize: 12,
      boxShadow: 'none',
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    boxShadow: 'none',
  }));

  return (
    <Container>
      <StyledAccordionSummary
        expandIcon={
          <StyledIconButton
            size="small"
            title="Edit member"
            onClick={() => setPermissionsManagementProjectId(projectId)}
          >
            <GroupIcon fontSize="small" />
          </StyledIconButton>
        }
      >
        Members
      </StyledAccordionSummary>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleEmail} className={classes.search}>
          <SearchIcon />
          <PanelTextField
            type="email"
            value={email}
            required
            disabled
            onChange={(e) => setEmail(e.target.value)}
            // placeholder="abc@email.com"
            placeholder="Search User"
            size="small"
            className={classes.searchField}
          />
        </form>

        <Button variant="contained">Invite People</Button>
      </div>

      <TableContainer>
        <StyledTable sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Member</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Guest</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {Object.keys(members).map((userId) => {
              const { userData, permissions } = members[userId];
              return (
                <Member
                  userData={userData}
                  permissions={permissions}
                  key={`project-user-pm-${userId}`}
                  project={projectId}
                />
              );
            })}
          </TableBody>
        </StyledTable>
      </TableContainer>
      <UserPermissionsModal
        projectId={permissionsManagementProjectId}
        onClose={() => setPermissionsManagementProjectId(null)}
      />
    </Container>
  );
};

export default ProjectMembers;
