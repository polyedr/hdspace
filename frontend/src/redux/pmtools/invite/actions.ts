import TYPES from '@Redux/actionTypes';

export const sidePanelError = (e: any) => ({ type: TYPES.ERROR, e });

export const requestSendEmail = (email: string) => ({
  type: TYPES.SEND_EMAIL_PM,
  payload: email,
});

export const successSendEmail = (email: string) => ({
  type: TYPES.SEND_EMAIL_PM_SUCCESS,
  payload: email,
});

export default sidePanelError;
