import React from 'react';
import { Button } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';

const InviteByEmail: React.FC = () => (
  <SideBarTitle title="Invite by Email" icon={MailIcon}>
    <PanelTextField type="email" placeholder="abc@email.com" required />
    <Button color="secondary" variant="contained" disabled>
      Invite
    </Button>
  </SideBarTitle>
);

export default InviteByEmail;
