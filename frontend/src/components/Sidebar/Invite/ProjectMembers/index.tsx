import { selectMembersWithPermissions } from '@Redux/pmtools/invite/selectors';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { selectUserData } from '@Redux/user/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import Member from './Member';

const ProjectMembers: React.FC = () => {
  const members: any = useSelector(selectMembersWithPermissions);
  const userData = useSelector(selectUserData);
  const project = useSelector(selectCurrentProject);

  return (
    <div>
      <div>
        <h2 style={{ marginBottom: 5 }}>Project Members</h2>
        {!members.length ? (
          <p>Members not found</p>
        ) : (
          members.map((member: any) => (
            <Member
              userData={userData}
              projectData={project}
              member={member}
              key={member.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectMembers;
