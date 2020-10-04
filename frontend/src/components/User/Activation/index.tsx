import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as Actions from '../../../redux/user/actions';
import LoginForm from '../LoginForm';
import { AppReduxState } from '../../../shared/types/app';
import Spinner from '../../UI/Spinner';
import { Info } from '../Info';

const styles = require('./Activation.scss');

const mapState = ({ user: { isLoading, authError } }: AppReduxState) => ({
  isLoading,
  authError,
});

const mapDispatch = {
  activateUser: Actions.activateUser,
};

type IProps = typeof mapDispatch & {
  isSignLoader: boolean;
};

const Activation: React.FC<IProps> = ({ activateUser, isSignLoader }) => {
  const match = useRouteMatch<{ params: any }>('/activate/:uid/:token');

  const { uid, token } = (match?.params as unknown) as {
    uid: string;
    token: string;
  };

  useEffect(() => {
    activateUser(uid, token);
  }, [activateUser]);

  return (
    <>
      <Info />
      <div className="signContainer">
        <div className={styles.formContainer}>
          <p className={styles.title}>Thanks for registration!</p>
          <LoginForm />
        </div>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export default connect(mapState, mapDispatch)(Activation);
