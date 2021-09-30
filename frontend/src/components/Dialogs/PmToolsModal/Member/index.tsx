import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { ModalAction } from '@Src/types/types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTokenPair } from '@Redux/user/selectors';
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
  const projectId = useSelector(selectCurrentProjectId);
  const [role, setRole] = useState(member?.role || '');
  const { access } = useSelector(selectTokenPair);
  const [permissions, setPermissions] = useState(!!rights);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (member) {
      dispatch(
        requestAddMember({
          role,
          access,
          status: 'member',
          user_id: member.id,
          project: projectId,
          username: member.username,
          action: `${member.username} (${role}) has been added`,
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
          access,
          id: member.id,
          role,
          status: member?.status,
          project: projectId,
          user_id: member.user_id,
          permissions: { write: permissions, prevState: member.permissions },
          username: member.user.username,
          action: `${member.user.username} (${member.role}) was edited`,
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

MembersModalContainer.defaultProps = {
  setSearch: null,
};

export default MembersModalContainer;
