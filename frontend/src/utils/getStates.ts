import { ISignFormElement, ISignFormFields } from '$constants/defaultParams';

export const getInitialFieldsState = (
  // TODO remove
  fields: ISignFormElement[],
): ISignFormFields =>
  fields.reduce(
    (currentInitialState, currentField) => ({
      ...currentInitialState,
      [currentField.value]: {
        value: '',
        label: currentField.label,
        placeholder: currentField.placeholder,
        isError: false,
        errorText: '',
      },
    }),
    {},
  );
