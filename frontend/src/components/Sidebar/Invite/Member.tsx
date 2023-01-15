import React, { useCallback, useState } from 'react';
import { Switch, IconButton, FormControlLabel } from '@mui/material';
import Avatar from '@Components/UI/Avatar';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ServerProject, UserData, UserProjectPermission } from '@Src/types';
import { styled } from '@mui/material/styles';
import * as Actions from '@Redux/permissions/actions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';

interface PropsType {
  project: ServerProject['id'];
  userData: UserData;
  permissions: string[];
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    boxShadow: 'none',
    textTransform: 'capitalize',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  boxShadow: 'none',
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Member: React.FC<PropsType> = ({ userData, permissions, project }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const { username, id } = userData;
  const rights = !!permissions.find(
    (p: string) => p === UserProjectPermission.CHANGE_PROJECT,
  );
  const dispatch = useDispatch();

  const handleTogglePermission = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        Actions.updateUserPermissionsForProject(
          project,
          id.toString(),
          e.target.checked
            ? [
                UserProjectPermission.VIEW_PROJECT,
                UserProjectPermission.CHANGE_PROJECT,
              ]
            : [UserProjectPermission.VIEW_PROJECT],
        ),
      );
    },
    [project, id],
  );

  const handleDelete = useCallback(() => {
    dispatch(
      Actions.updateUserPermissionsForProject(project, id.toString(), []),
    );
  }, [project, id]);

  const handleRequestDelete = useCallback(
    (show: boolean) => () => setShowDeleteConfirm(show),
    [],
  );

  return (
    <>
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
          <FormControlLabel
            control={
              <Switch onChange={handleTogglePermission} checked={rights} />
            }
            label={rights ? 'READ, WRITE' : 'READ'}
          />
        </StyledTableCell>
        <StyledTableCell>
          <IconButton onClick={handleRequestDelete(true)}>
            <DeleteOutlineIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
      <ConfirmModal
        action={handleDelete}
        elementText={userData.email}
        hide={handleRequestDelete(false)}
        show={showDeleteConfirm}
        actionText="remove"
      />
    </>
  );
};

export default Member;
