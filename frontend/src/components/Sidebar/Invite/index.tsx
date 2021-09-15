import React from 'react';
import { Button, Container } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { SideBarTitle, StyledTextField } from '@Components/styledComponents';
// import Members from './ProjectMembers';
// import Search from './Search';
// import Invite from './InviteByEmail';

const InviteTab: React.FC = () => (
  <Container data-testid="title">
    <SideBarTitle title="Invite by Email" icon={MailIcon}>
      <StyledTextField type="email" placeholder="abc@email.com" required />
      <Button color="secondary" variant="contained" disabled>
        Invite
      </Button>
    </SideBarTitle>
    {/* <Invite />
    <Search />
    <Members /> */}
  </Container>
);

export default InviteTab;
