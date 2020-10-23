/* eslint-disable camelcase */

export interface ITokenPair {
  access: string;
  refresh: string;
}

export type LoginFormData = {
  username: string;
  password: string;
};

export type SignupFormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
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

export type ProfileData = {
  avatar: null | string;
  approved: boolean;
  role: string;
  hourlyRate: number;
};

export type UserData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: Date | null;
  isActive: boolean;
  id: number;
  password: string;
};

export type TotalUserData = ProfileData & UserData;

export type UserState = {
  isLPanelMinimized: boolean;
  isPrototypeMode: boolean;
  freeCanvasMode: {
    enabled: boolean;
  };
  tokenPair: ITokenPair;
  isLoadedToken: boolean;
  isLoggedIn: boolean;
  authError: Error | null;
  userData: TotalUserData;
  restorePasswordEmail?: string;
  restoreUserId?: number;
  isLoading: boolean;
  confirmMessage: string;
};

export type UnsafeReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : any;

export type FreeElement = {
  id: string;
  top: number;
  left: number;
  type: 'freeElement';
  name: string;
};
