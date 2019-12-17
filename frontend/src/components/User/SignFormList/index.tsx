import React from 'react';

import { ISignFormElement, ISignFormFields } from '$constants/defaultParams';

const styles = require('./SignFormList.scss');

interface IProps {
  fields: ISignFormElement[],
  formData: ISignFormFields,
  handleInputChange: (event: React.FormEvent) => void,
}

export const SignFormList: React.FunctionComponent<IProps> = ({
  fields,
  formData,
  handleInputChange,
}) => (
  <ul>
    {
      fields.map(currentField => (
        <li
          key={`sign-${currentField.value}`}
          className={styles.signFormItem}
        >
          <label
            className={styles.signFormLabel}
            htmlFor={currentField.value}
          >
            {
              currentField.label
            }
            <input
              className={styles.signFormInput}
              type={currentField.type}
              name={currentField.value}
              id={currentField.value}
              value={formData[currentField.value].value}
              placeholder={formData[currentField.value].placeholder}
              onChange={handleInputChange}
            />
          </label>
          {
            formData[currentField.value].isError && (
              <p
                className={styles.signFormErrorText}
              >
                {formData[currentField.value].errorText}
              </p>
            )
          }
        </li>
      ))
    }
  </ul>
);
