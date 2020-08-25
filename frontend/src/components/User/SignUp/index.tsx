import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import Info from '$components/User/Info';
import Button from '$components/UI/Button';
import Spinner from '$components/UI/Spinner';
import {
  DEFAULT_SIGNUP_FIELDS,
  DEFAULT_RESPONSE_ERROR,
  ISignFormFields,
} from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';
import {
  generateValidatedFormData,
  INewFormData,
} from '$utils/generateValidatedFormData';
import { getInitialFieldsState } from '$utils/getStates';
import { IApiResponseError } from '$redux/user/types';
import SignFormList from '$components/User/SignFormList';

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setApiResponseError,
  setNewUser: Actions.setNewUser,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

const SignUp: React.FunctionComponent<IProps> = ({
  isSignLoader,
  apiResponseError,
  setApiResponseError,
  setNewUser,
}) => {
  const [formData, setFormData] = useState<ISignFormFields>(
    getInitialFieldsState(DEFAULT_SIGNUP_FIELDS),
  );

  useEffect(() => {
    return () => {
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }

      const newFormData: INewFormData = generateValidatedFormData(formData);

      setFormData(newFormData.formData);

      if (!newFormData.isValidationError) {
        setNewUser(
          newFormData.formData.username.value,
          newFormData.formData.email.value,
          newFormData.formData.firstName.value,
          newFormData.formData.lastName.value,
          newFormData.formData.password.value,
        );
      }
    },
    [formData, apiResponseError, setApiResponseError, setNewUser],
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

  return (
    <>
      <Info isSignUp={false} />
      <div className="signContainer">
        <form onSubmit={handleOnSubmit}>
          <SignFormList
            fields={DEFAULT_SIGNUP_FIELDS}
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
              Sign Up
            </Button>
          </div>
        </form>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
