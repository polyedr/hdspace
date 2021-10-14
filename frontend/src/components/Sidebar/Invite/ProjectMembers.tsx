import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import { StyledIconButton } from '@Components/styledComponents';
import GroupIcon from '@material-ui/icons/Group';
import * as Actions from '@Redux/permissions/actions';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Member from './Member';

const ProjectMembers: React.FC = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectAllUsersPermissions);
  const projectId = useSelector(selectCurrentProjectId);
  const [
    permissionsManagementProjectId,
    setPermissionsManagementProjectId,
  ] = useState<number | null>(null);

  useEffect(() => {
    dispatch(Actions.getAllUsersProjectPermissions(projectId));
  }, [dispatch, projectId]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Project Members</h2>
        <StyledIconButton
          size="small"
          title="Edit member"
          onClick={() => setPermissionsManagementProjectId(projectId)}
        >
          <GroupIcon fontSize="small" />
        </StyledIconButton>
      </div>

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
      <UserPermissionsModal
        projectId={permissionsManagementProjectId}
        onClose={() => setPermissionsManagementProjectId(null)}
      />
    </div>
  );
};

export default ProjectMembers;
