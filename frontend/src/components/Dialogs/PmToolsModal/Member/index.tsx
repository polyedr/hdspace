import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { ModalAction } from '@Src/types/types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MemberData } from '@Src/types/pmtools/types';
import {
  requestAddMember,
  requestEditMember,
} from '@Redux/pmtools/invite/actions/members';
import MembersModal from './MembersModal';

type Props = {
  show: boolean;
  hide: () => void;
  action: ModalAction;
  member: MemberData;
  setSearch?: any;
  rights?: boolean;
};

const MembersModalContainer: React.FC<Props> = ({
  show,
  hide,
  action,
  member,
  setSearch,
  rights,
}) => {
  const dispatch = useDispatch();
  const { username, id } = member;
  const projectId = useSelector(selectCurrentProjectId);
  const [role, setRole] = useState(member?.role || '');
  const [permissions, setPermissions] = useState(!!rights);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (member) {
      dispatch(
        requestAddMember({
          role,
          status: 'member',
          user_id: id,
          project: projectId,
          permissions: ['view_project'],
          username,
          action: `${username} (${role}) has been added`,
        }),
      );
    }
    setSearch('');
    hide();
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (member) {
      dispatch(
        requestEditMember({
          id,
          role,
          status: member?.status,
          project: projectId,
          user_id: id,
          permissions: permissions
            ? ['view_project', 'change_project']
            : ['view_project'],
          username,
          action: `${username} (${member.role}) was edited`,
        }),
      );
    }
    hide();
  };

  return (
    <MembersModal
      show={show}
      action={action}
      close={hide}
      save={handleSave}
      edit={handleEdit}
      memberData={{ role, status: member?.status || '' }}
      changeRole={setRole}
      permissions={permissions}
      changePermissions={setPermissions}
    />
  );
};

export default MembersModalContainer;
