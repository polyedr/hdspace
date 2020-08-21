/* eslint-disable global-require */
export interface IImages {
  [key: string]: string;
}

export const IMAGES = {
  default: null,
  prof: require('../assets/sprites/profile_empty.png'),
  logo: require('../assets/sprites/logo.png'),
  imageIcon: require('../assets/images/image-icon.svg'),
  imageIconSmall: require('../assets/images/image-icon-small.svg'),
  youtubeIcon: require('../assets/images/youtube.svg'),
};
