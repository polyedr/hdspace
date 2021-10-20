import React, { FormEvent, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';
import { useDispatch, useSelector } from 'react-redux';
import { requestSendEmail } from '@Redux/pmtools/invite/actions';
import { selectEmail } from '@Redux/pmtools/invite/selectors';

const InviteByEmail: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const successEmail = useSelector(selectEmail);
  const dispatch = useDispatch();
  const handleEmail = (e: FormEvent) => {
    e.preventDefault();
    dispatch(requestSendEmail(email));
  };

  useEffect(() => {
    setMessage(successEmail);
    if (successEmail) {
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [email, successEmail]);

  return (
    <SideBarTitle title="Invite by Email" icon={MailIcon}>
      <form onSubmit={handleEmail}>
        <PanelTextField
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="abc@email.com"
        />

        <Button
          type="submit"
          disabled={!email}
          color="secondary"
          variant="contained"
        >
          Invite
        </Button>
      </form>
      {message && <p>Email Send</p>}
    </SideBarTitle>
  );
};

export default InviteByEmail;
