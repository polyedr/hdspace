/* eslint-disable camelcase */

export interface ITokenPair {
  access: string;
  refresh: string;
}

export type LoginFormData = {
  username: string;
  password: string;
};

export type ServerProfileData = {
  avatar: null | string;
  hourly_rate: number;
  approved: boolean;
  role: string;
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

export type TotalServerUserData = ServerUserData & ServerProfileData;

export interface UserData {
  avatar: null | string;
  approved: boolean;
  role: string;
  hourlyRate: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: Date | null;
  isActive: boolean;
  id: number;
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
