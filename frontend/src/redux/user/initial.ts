import { UserState } from '@Redux/types';
import { Experience } from '@Src/types';

// eslint-disable-next-line import/prefer-default-export
export const initialUserState: UserState = {
  isLPanelMinimized: false,
  isPrototypeMode: false,
  freeCanvasMode: {
    enabled: false,
  },
  dropTargetBordersMode: true,
  userData: {
    isActive: false,
    dateJoined: null,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    id: 0,
    profile: {
      hourlyRate: 0,
      approved: false,
      avatar: null,
      id: 0,
      role: '',
      experienced: Experience.BEGINNER,
      parameters: {
        avatarCrop: '',
        profileDataParameters: {
          autoSwitchTabs: false,
          dropTargetBordersMode: true,
        },
        passwordZulip: '',
      },
    },
  },
  isLoggedIn: false,
  tokenPair: {
    access: '',
    refresh: '',
  },
  isTokenLoaded: true,
  error: null,
  isLoading: false,
  confirmMessage: '',
  userGuide: {
    active: false,
  },
  chat: {
    apiKey: '',
    realm: '',
    username: '',
  },

  subscriptionData: [],
};
