import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import * as Actions from '@Redux/permissions/actions';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestSendEmail } from '@Redux/pmtools/invite/actions';
import {
  Button,
  Container,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Member from './Member';

const ProjectMembers: React.FC = () => {
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
      <Typography variant="h5" marginBottom={3} marginTop={3}>
        Team
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search User"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={() => setPermissionsManagementProjectId(projectId)}
          variant="contained"
        >
          Invite People
        </Button>
      </Stack>

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
