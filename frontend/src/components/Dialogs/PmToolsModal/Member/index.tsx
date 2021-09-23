import {
  addMemberAction,
  editMembersAction,
} from '@Redux/pmtools/invite/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { ModalAction } from '@Src/types';
import { IMemberToFrontend } from '@Src/pm-types/invite/types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTokenPair } from '@Redux/user/selectors';
import MembersModal from './MembersModal';

type Props = {
  show: boolean;
  hide: () => void;
  action: ModalAction;
  member: IMemberToFrontend;
  rights?: string;
  setSearch?: any;
};

const MembersModalContainer: React.FC<Props> = ({
  show,
  hide,
  action,
  member,
  rights,
  setSearch,
}) => {
  const dispatch = useDispatch();
  const projectId = useSelector(selectCurrentProjectId);
  const [role, setRole] = useState(member?.role || '');
  const [permissions, setPermissions] = useState(!!rights);
  const { access } = useSelector(selectTokenPair);

  useEffect(() => {
    setPermissions(!!rights);
  }, [rights]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (member) {
      dispatch(
        addMemberAction({
          role,
          access,
          status: 'member',
          userId: member.id,
          projectId,
          // action: `${member.username} (${role}) has been added`,
          // permissions: { write: false, prevState: ['view_project'] },
          // username: member.username,
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
        editMembersAction({
          access,
          id: member.id,
          role,
          status: member?.status,
          projectId,
          userId: member.user_id,
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
      permissions={permissions}
      changePermissions={setPermissions}
      changeRole={setRole}
    />
  );
};

MembersModalContainer.defaultProps = {
  rights: '',
  setSearch: null,
};

export default MembersModalContainer;
