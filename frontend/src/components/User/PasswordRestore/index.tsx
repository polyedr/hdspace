import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import Button from '$components/UI/Button';
import Spinner from '$components/UI/Spinner';
import { openSignScreen } from '$utils/history';
import { getInitialFieldsState } from '$utils/getStates';
import {
  DEFAULT_RESTORE_PASSWORD_FIELDS,
  DEFAULT_RESPONSE_ERROR,
  ISignFormFields,
} from '$constants/defaultParams';
import { IApiResponseError } from '$redux/user/types';
import * as Actions from '$redux/user/actions';
import SignFormList from '$components/User/SignFormList';
import {
  generateValidatedFormData,
  INewFormData,
} from '$utils/generateValidatedFormData';

const styles = require('./PasswordRestore.scss');

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setApiResponseError,
  setNewPassword: Actions.setNewPassword,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

const PasswordRestore: React.FC<IProps> = ({
  isSignLoader,
  apiResponseError,
  setApiResponseError,
  setNewPassword,
}) => {
  const [restorePassword, setRestorePassword] = useState<ISignFormFields>(
    getInitialFieldsState(DEFAULT_RESTORE_PASSWORD_FIELDS),
  );

  const handleCloseButton = useCallback(() => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    openSignScreen('signin');
  }, [setApiResponseError, apiResponseError]);

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }

      const newRestorePassword: INewFormData = generateValidatedFormData(
        restorePassword,
      );

      setRestorePassword(newRestorePassword.formData);

      if (!newRestorePassword.isValidationError) {
        setNewPassword(newRestorePassword.formData.password.value);
      }
    },
    [apiResponseError, setApiResponseError, restorePassword, setNewPassword],
  );

  const handleInputChange = useCallback(
    ({ target }) => {
      const newRestorePassword = {
        ...restorePassword,
        [target.name]: {
          ...restorePassword[target.name],
          value: target.value,
        },
      };

      setRestorePassword(newRestorePassword);
    },
    [restorePassword],
  );

  return (
    <div className={styles.restoreContainer}>
      <form className={styles.restoreForm} onSubmit={handleFormSubmit}>
        <SignFormList
          fields={DEFAULT_RESTORE_PASSWORD_FIELDS}
          formData={restorePassword}
          handleInputChange={handleInputChange}
        />
        {apiResponseError.errorStatus !== -1 && (
          <p className="signAuthorisationErrorText">
            {apiResponseError.errorText}
          </p>
        )}
        <div className={styles.restoreBtnBlock}>
          <Button
            className={classNames(styles.restoreBtn, 'signSubmitBtn')}
            onClick={handleCloseButton}
          >
            Close
          </Button>
          <Button className="signSubmitBtn" type="submit">
            Confirm
          </Button>
        </div>
      </form>
      <Spinner active={isSignLoader} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordRestore);
