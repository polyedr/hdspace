import { selectMembersWithPermissions } from '@Redux/pmtools/invite/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import Member from './Member';

const ProjectMembers: React.FC = () => {
  const members = useSelector(selectMembersWithPermissions);
  return (
    <div>
      <h2 style={{ marginBottom: 5 }}>Project Members</h2>
      {!members.length ? (
        <p>Members not found</p>
      ) : (
        members.map((member: any) => <Member member={member} key={member.id} />)
      )}
    </div>
  );
};

export default ProjectMembers;
