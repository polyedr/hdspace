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
import { removeMemberAction } from '@Redux/pmtools/invite/actions';
import { IMemberToFrontend, Permission } from '@Src/types/invite/types';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { StyledIconButton } from '@Components/styledComponents';
import MembersModalContainer from '@Components/Dialogs/PmToolsModal/Member';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { ModalAction } from '@Src/types';

type PropsType = {
  member: IMemberToFrontend;
};

const Member: React.FC<PropsType> = ({ member }) => {
  const dispatch = useDispatch();
  const projectId = useSelector(selectCurrentProjectId);
  const { id, role, user, permissions } = member;
  const [editMember, setEditMember] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const rights = permissions?.find((p: Permission) => p === 'change_project');

  const removeHandler = () => {
    const action = `${user.username} (${role}) has been deleted`;
    dispatch(removeMemberAction({ memberId: id, projectId, action }));
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
          title="Edit member"
          onClick={() => setEditMember(true)}
        >
          <EditIcon />
        </StyledIconButton>
        <StyledIconButton
          title="Delete member"
          onClick={() => setShowConfirmModal(true)}
        >
          <DeleteIcon />
        </StyledIconButton>
      </ListItem>

      <MembersModalContainer
        member={member}
        rights={rights}
        show={editMember}
        hide={() => setEditMember(false)}
        action={ModalAction.Edit}
      />
      <ConfirmModal
        show={showConfirmModal}
        elementText="Member"
        action={removeHandler}
        hide={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default Member;
