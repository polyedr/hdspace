/* eslint-disable camelcase */

export interface ITokenPair {
  access: string;
  refresh: string;
}

export type LoginFormData = {
  username: string;
  password: string;
};

export type ServerUserData = {
  date_joined: string;
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  id: number;
  is_active: boolean;
};

export interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  id?: number;
  password?: string;
}

export interface IApiResponseError {
  errorStatus: number;
  errorText: string;
}

export type IRootState = Readonly<{
  isLPanelMinimized: boolean;
  isNavPanelMinimized: boolean;
  isPrototypeMode: boolean;
  tokenPair: ITokenPair;
  isLoadedToken: boolean;
  apiResponseError: IApiResponseError;
  userData: UserData;
  restorePasswordEmail?: string;
  restoreUserId?: number;
  isSignLoader: boolean;
}>;

export type UnsafeReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : any;
