import {
  checkFormFieldValidity,
  checkPasswordFieldValidity,
  checkEmailFieldValidity,
} from '$utils/StringHelper';
import { ISignFormFields } from '$constants/defaultParams';

export interface INewFormData {
  formData: ISignFormFields;
  isValidationError: boolean;
}

export const generateValidatedFormData = (
  // TODO remove
  formData: ISignFormFields,
  isUsernameAndPasswordCheck: boolean = true,
): INewFormData => {
  let isValidationError = false;
  let passwordFieldValue = '';
  let confirmPasswordFieldValue = '';

  const newFormData = Object.keys(formData).reduce(
    (currentNewFormData, key) => {
      let validationErrorText = '';

      if (formData[key].value.trim() === '') {
        isValidationError = true;
        validationErrorText = `Field ${formData[key].label} is required`;
      } else if (key === 'password' || key === 'confirmPassword') {
        passwordFieldValue =
          key === 'password' ? formData[key].value.trim() : passwordFieldValue;
        confirmPasswordFieldValue =
          key === 'confirmPassword'
            ? formData[key].value.trim()
            : confirmPasswordFieldValue;

        if (isUsernameAndPasswordCheck) {
          if (!checkPasswordFieldValidity(formData[key].value.trim())) {
            isValidationError = true;
            validationErrorText = `Field ${formData[key].label} does not meet the requirements`;
          }

          if (
            passwordFieldValue !== '' &&
            confirmPasswordFieldValue !== '' &&
            passwordFieldValue !== confirmPasswordFieldValue
          ) {
            isValidationError = true;
            validationErrorText =
              'Fields Password and Confirm password does not match';
          }
        }
      } else if (key === 'email') {
        if (!checkEmailFieldValidity(formData[key].value.trim())) {
          isValidationError = true;
          validationErrorText = `Field ${formData[key].label} does not meet the requirements`;
        }
      } else if (key === 'username') {
        if (isUsernameAndPasswordCheck) {
          if (!checkFormFieldValidity(formData[key].value.trim())) {
            isValidationError = true;
            validationErrorText = `Field ${formData[key].label} does not meet the requirements`;
          }
        }
      } else if (!checkFormFieldValidity(formData[key].value.trim())) {
        isValidationError = true;
        validationErrorText = `Field ${formData[key].label} must contain only latin letters and numbers`;
      }

      return {
        ...currentNewFormData,
        [key]: {
          ...formData[key],
          isError: isValidationError,
          errorText: validationErrorText,
        },
      };
    },
    {},
  );

  return {
    formData: newFormData,
    isValidationError,
  };
};
