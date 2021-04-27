export enum MessageType {
  sidebarLogoutSuccess = 'sidebarLogoutSuccess',
  setChatCredentials = 'setChatCredentials',
  chatLogout = 'chatLogout',
  setAccessToken = 'setAccessToken',
  setProjectId = 'setProjectId',
  setUserData = 'setUserData',
  logout = 'logout',
}

export type IframeMessage = {
  type: MessageType;
  payload?: any;
};
