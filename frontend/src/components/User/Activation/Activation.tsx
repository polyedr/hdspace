import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch, NavLink } from 'react-router-dom';

import { user } from '$constants/pathNames';
import { Info } from '$components/User/Info';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/types';

const styles = require('./Activation.scss');

const mapDispatch = {
  setApiResponseError: Actions.setApiResponseError,
  activateUser: Actions.activateUser,
};

type IProps = typeof mapDispatch & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

const Activation: React.FC<IProps> = ({ activateUser }) => {
  const match = useRouteMatch<{ params: any }>('/activate/:uid/:token');

  useEffect(() => {
    if (match) {
      const { uid, token } = (match.params as unknown) as {
        uid: string;
        token: string;
      };
      activateUser(uid, token);
    }
  }, [activateUser, match]);

  return (
    <>
      <Info />

      <p>Thanks for registration!</p>
      <NavLink
        className={styles.link}
        to={user.signin}
        activeClassName="active"
      >
        Log in.
      </NavLink>
    </>
  );
};

const Component = connect(null, mapDispatch)(Activation);

export { Component as Activation };
