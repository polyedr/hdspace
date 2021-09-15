/* eslint-disable camelcase */
export enum Experience {
  BEGINNER = 'BEGINNER',
  EXPERIENCED = 'EXPERIENCED',
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: Date | null;
  is_active: boolean;
  password: string;
  profile: ProfileType;
}

// ==============================
type ProfileType = {
  avatar: null | string;
  approved: boolean;
  role: string;
  hourlyRate: number;
  id: number;
  experienced: Experience;
};
