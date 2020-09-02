import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Info from '../Info';
import SignFormList from '../SignFormList';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import Spinner from '../../UI/Spinner';
import {
  login,
  restorePassword,
  setApiResponseError,
} from '../../../redux/user/actions';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNIN_FIELDS,
  ISignFormFields,
} from '../../../constants/defaultParams';
import { AppReduxState } from '../../../shared/types/app';
import { getInitialFieldsState } from '../../../utils/getStates';
import {
  generateValidatedFormData,
  INewFormData,
} from '../../../utils/generateValidatedFormData';
import { IApiResponseError } from '../../../redux/user/types';

const styles = require('./SignIn.scss');

const IS_NAME_AND_PASSWORD_CHECK = false;

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
});

const mapDispatchToProps = {
  restorePassword,
  setApiResponseError,
  login,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

export const UnmountedSignIn: React.FC<IProps> = ({
  apiResponseError,
  isSignLoader,
  restorePassword,
  setApiResponseError,
  login,
}) => {
  const [formData, setFormData] = useState<ISignFormFields>(
    getInitialFieldsState(DEFAULT_SIGNIN_FIELDS),
  );
  const [isRestorePasswordModalOpen, setIsRestorePasswordModalOpen] = useState<
    boolean
  >(false);
  const [restoreEmail, setRestoreEmail] = useState<string>('');

  useEffect(() => {
    return () => {
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

  const closeModal = useCallback(() => {
    setRestoreEmail('');
    setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
  }, [isRestorePasswordModalOpen]);

  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }

      const newFormData: INewFormData = generateValidatedFormData(
        formData,
        IS_NAME_AND_PASSWORD_CHECK,
      );

      setFormData(newFormData.formData);

      if (!newFormData.isValidationError) {
        login({
          username: newFormData.formData.username.value,
          password: newFormData.formData.password.value,
        });
      }
    },
    [formData, login, apiResponseError, setApiResponseError],
  );

  const handleOnChange = useCallback(
    (event) => {
      const newFormData = {
        ...formData,
        [event.target.name]: {
          ...formData[event.target.name],
          value: event.target.value,
        },
      };

      setFormData(newFormData);
    },
    [formData],
  );

  const handleRestorePasswordBtn = useCallback(
    (event) => {
      event.preventDefault();

      setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
    },
    [isRestorePasswordModalOpen],
  );

  const onRestoreEmailFieldChange = useCallback(({ target }) => {
    setRestoreEmail(target.value);
  }, []);

  const handleConfirmPasswordRestore = useCallback(
    (event) => {
      event.preventDefault();

      restorePassword(restoreEmail);
      closeModal();
    },
    [restoreEmail, restorePassword, closeModal],
  );

  return (
    <>
      <Info isSignUp />
      <div className="signContainer">
        <form onSubmit={handleOnSubmit}>
          <p className={styles.signinTitle}>Login to your account</p>
          <SignFormList
            fields={DEFAULT_SIGNIN_FIELDS}
            formData={formData}
            handleInputChange={handleOnChange}
          />
          <div className="signButtonBlock">
            {apiResponseError.errorStatus !== -1 && (
              <p className="signAuthorisationErrorText">
                {apiResponseError.errorText}
              </p>
            )}
            <Button className="signSubmitBtn" type="submit" styleType="none">
              Login
            </Button>
            <Button
              className={styles.signinLink}
              styleType="none"
              onClick={handleRestorePasswordBtn}
            >
              Forgot password?
            </Button>
          </div>
        </form>
      </div>
      {isRestorePasswordModalOpen && (
        <Modal
          animClassName="bubbleAnimation"
          bodyClassName={styles.passwordRestoreModalBody}
          title="Restore password"
          confirmText="Send"
          cancelText="Close"
          onClose={closeModal}
          onConfirm={handleConfirmPasswordRestore}
        >
          <p>Please, enter your email adress.</p>
          <input
            className="modalTextInput"
            type="email"
            name="restore_email"
            id="restore_email"
            placeholder="example@gmail.com"
            value={restoreEmail}
            onChange={onRestoreEmailFieldChange}
          />
        </Modal>
      )}
      <Spinner active={isSignLoader} />
    </>
  );
};

export const SignIn = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnmountedSignIn);
