import React, { useCallback, useState, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { Info } from '$components/User/Info';
import { Button } from '$components/UI/Button';
import { Spinner } from '$components/UI/Spinner';
import { DEFAULT_SIGNUP_FIELDS, DEFAULT_RESPONSE_ERROR, ISignFormFields } from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';
import { generateValidatedFormData, INewFormData } from '$utils/generateValidatedFormData';
import { getInitialFieldsState } from '$utils/getStates';
import { IApiResponseError } from '$redux/user/reducer';
import { SignFormList } from '$components/User/SignFormList';

const styles = require('./styles.scss');

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
  apiResponseError: IApiResponseError,
  isSignLoader: boolean,
}

const UnconnectedSignUp: React.FunctionComponent<IProps> = ({
  isSignLoader,
  apiResponseError,
  setApiResponseError,
  setNewUser,
}) => {
  const [formData, setFormData] = useState<ISignFormFields>(getInitialFieldsState(DEFAULT_SIGNUP_FIELDS));

  useEffect(() => {
    return () => {
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

  const handleOnSubmit = useCallback((event) => {
    event.preventDefault();

    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    const newFormData: INewFormData = generateValidatedFormData(formData);

    setFormData(newFormData.formData);

    if (!newFormData.isValidationError) {
      setNewUser(
        newFormData.formData['username'].value,
        newFormData.formData['email'].value,
        newFormData.formData['firstName'].value,
        newFormData.formData['lastName'].value,
        newFormData.formData['password'].value,
      );
    }
  }, [formData, apiResponseError, setApiResponseError, setNewUser]);

  const handleOnChange = useCallback((event) => {
    const newFormData = {
      ...formData,
      [event.target.name]: {
        ...formData[event.target.name],
        value: event.target.value,
      },
    };

    setFormData(newFormData);
  }, [formData]);

  return (
    <React.Fragment>
      <Info
        isSignUp={false}
      />
      <div className="signContainer">
        <form
          onSubmit={handleOnSubmit}
        >
          <SignFormList
            fields={DEFAULT_SIGNUP_FIELDS}
            formData={formData}
            handleInputChange={handleOnChange}
          />
          <div className="signButtonBlock">
            {
              apiResponseError.errorStatus !== -1 && (
                <p className="signAuthorisationErrorText">
                  {apiResponseError.errorText}
                </p>
              )
            }
            <Button
              className="signSubmitBtn"
              type="submit"
              styleType="none"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
      <Spinner active={isSignLoader} />
    </React.Fragment>
  );
};

export const SignUp = connect(mapStateToProps, mapDispatchToProps)(hot(module)(UnconnectedSignUp));
