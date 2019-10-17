import React from 'react';
import { NavLink } from 'react-router-dom';

import { user } from '$constants/pathNames';

const styles = require('./styles.scss');

interface IProps {
  isSignUp: boolean,
}

export const Info: React.FunctionComponent<IProps> = ({
  isSignUp,
}) => {
  return (
    <div className={styles.infoContainer}>
      <h2 className={styles.infoTitle}>adevi</h2>
      <p className={styles.infoDescription}>
        AI Assistant for App Development that is excellent for:
      </p>
      <ul>
        <li className={styles.infoListItem}>
          * Non-technical people to build full length web or mobile application
        </li>
        <li className={styles.infoListItem}>
          * Developers to quickly generate the most complete front-end code
        </li>
      </ul>
      <h2 className={styles.infoSubTitle}>
        {
          isSignUp ? 'Welcome' : 'Register'
        }
      </h2>
      {
        isSignUp && (
          <p>
            Register for ADEVI account here.
          </p>
        )
      }
      <NavLink
        className={styles.navigationLink}
        to={isSignUp ? user.signup : user.signin}
        activeClassName="active"
      >
        <span>
          {
            isSignUp ? 'Register now' : 'I allready have an account'
          }
        </span>
      </NavLink>
    </div>
  );
};
