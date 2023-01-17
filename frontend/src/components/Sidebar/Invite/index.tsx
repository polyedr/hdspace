import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import * as Actions from '@Redux/permissions/actions';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
// import { requestSendEmail } from '@Redux/pmtools/invite/actions';
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
import fuzzysort from 'fuzzysort';
import Member from './Member';

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

const ProjectMembers: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();
  // const [email, setEmail] = useState('');
  const members = useSelector(selectAllUsersPermissions);
  const projectId = useSelector(selectCurrentProjectId);
  const [permissionsManagementProjectId, setPermissionsManagementProjectId] =
    useState<number | null>(null);

  // const handleEmail = (e: FormEvent) => {
  //   e.preventDefault();
  //   dispatch(requestSendEmail(email));
  // };

  useEffect(() => {
    dispatch(Actions.getAllUsersProjectPermissions(projectId));
  }, [dispatch, projectId]);

  const filteredUsers = useMemo(() => {
    const users = Object.values(members).map((m) => m.userData);

    if (searchText.trim().length > 0) {
      return fuzzysort
        .go(searchText, users, {
          keys: ['email', 'username', 'first_name', 'last_name'],
        })
        .map((r) => r.obj);
    }

    return users;
  }, [members, searchText]);

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  return (
    <Container>
      <Typography variant="h5" marginBottom={3} marginTop={3}>
        Team
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          value={searchText}
          onChange={handleChangeSearch}
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
              <StyledTableCell>Permissions</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((userData) => (
              <Member
                userData={userData}
                permissions={members[userData.id].permissions}
                key={`project-user-pm-${userData.id}`}
                project={projectId}
              />
            ))}
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
