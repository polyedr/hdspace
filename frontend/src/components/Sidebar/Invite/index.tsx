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

      <form onSubmit={handleEmail}>
        <PanelTextField
          type="email"
          value={email}
          required
          disabled
          onChange={(e) => setEmail(e.target.value)}
          placeholder="abc@email.com"
        />
      </form>

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
    </Container>
  );
};

export default ProjectMembers;
