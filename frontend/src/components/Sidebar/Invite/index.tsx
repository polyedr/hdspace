import React from 'react';
import { Container } from '@material-ui/core';
import Members from './ProjectMembers';
import Search from './Search';
import Invite from './InviteByEmail';

const InviteTab: React.FC = () => (
  <Container data-testid="title">
    <Invite />
    <Search />
    <Members />
  </Container>
);

export default InviteTab;
