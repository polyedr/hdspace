import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { MemberData, Permission } from '@Src/types/pmtools/types';
import { StyledIconButton } from '@Components/styledComponents';
import MembersModalContainer from '@Components/Dialogs/PmToolsModal/Member';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { ModalAction } from '@Src/types/types';
import { selectTokenPair } from '@Redux/user/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { requestRemoveMember } from '@Redux/pmtools/invite/actions/members';

type PropsType = {
  member: MemberData;
};

const Member: React.FC<PropsType> = ({ member }) => {
  const dispatch = useDispatch();
  const { access } = useSelector(selectTokenPair);
  const project = useSelector(selectCurrentProjectId);
  const { id, role, user, permissions } = member;
  const [editMember, setEditMember] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const rights = !!permissions?.find((p: Permission) => p === 'change_project');

  const removeHandler = () => {
    const action = `${user.username} has been removed`;
    dispatch(
      requestRemoveMember({
        id,
        access,
        action,
        project,
        permissions: [],
        username: user.username,
      }),
    );
  };

  return (
    <>
      <ListItem button key={id} style={{ padding: 0 }}>
        <ListItemAvatar>
          <Avatar src={user.profile.avatar || ''} />
        </ListItemAvatar>
        <ListItemText
          primary={role}
          secondary={user.username}
          secondaryTypographyProps={{ style: { color: '#fff' } }}
          primaryTypographyProps={{ style: { fontSize: '14px' } }}
        />
        {permissions && (
          <p style={{ fontSize: 10 }}>{rights ? 'READ, WRITE' : 'READ'}</p>
        )}
        <StyledIconButton
          size="small"
          title="Edit member"
          onClick={() => setEditMember(true)}
        >
          <EditIcon />
        </StyledIconButton>
        <StyledIconButton
          size="small"
          title="Delete member"
          onClick={() => setShowConfirmModal(true)}
        >
          <DeleteIcon />
        </StyledIconButton>
      </ListItem>

      <MembersModalContainer
        rights={rights}
        member={member}
        show={editMember}
        hide={() => setEditMember(false)}
        action={ModalAction.Edit}
      />
      <ConfirmModal
        show={showConfirmModal}
        elementText="member"
        action={removeHandler}
        hide={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default Member;
