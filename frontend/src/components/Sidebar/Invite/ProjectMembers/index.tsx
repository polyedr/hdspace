import {
  selectMembersLoader,
  selectMembersWithPermissions,
} from '@Redux/pmtools/invite/selectors';
import { IMemberToFrontend } from '@Src/pm-types/invite/types';
import React from 'react';
import { useSelector } from 'react-redux';
import Member from './Member';

const ProjectMembers: React.FC = () => {
  const loader = useSelector(selectMembersLoader);
  const members = useSelector(selectMembersWithPermissions);

  if (loader) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 5 }}>Project Members</h2>
      {!members.length ? (
        <p>Members not found</p>
      ) : (
        members.map((member: IMemberToFrontend) => (
          <Member member={member} key={member.id} />
        ))
      )}
    </div>
  );
};

export default ProjectMembers;
