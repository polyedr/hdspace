export type IOrganization = {
  desc: string;
  descData: unknown;
  displayName: string;
  id: string;
  idMemberCreator: string;
  limits: unknown;
  logoUrl: unknown;
  logoHash: unknown;
  name: string;
  powerUps: unknown;
  products: unknown;
  teamType: unknown;
  url: string;
  website: unknown;
};

export type IBoard = {
  closed: boolean;
  desc: unknown;
  descData: unknown;
  id: string;
  idEnterprise: any;
  idOrganization: string;
  labelNames: { [key: string]: string };
  limits: unknown;
  name: string;
  pinned: boolean;
  prefs: { [key: string]: string };
  shortUrl: string;
  url: string;
};

export type IBoardForUI = {
  closed: boolean;
  desc: unknown;
  descData: unknown;
  id: string;
  organization?: IOrganization | null;
  idEnterprise: any;
  idOrganization: string;
  labelNames: { [key: string]: string } | null;
  limits: unknown;
  name: string;
  pinned: boolean;
  prefs: { [key: string]: string } | null;
  shortUrl: string;
  url: string;
};

export interface IServerListData {
  closed: boolean;
  id: string | number;
  idBoard: string;
  name: string;
  pos: number;
  softLimit: null;
  subscribed: boolean;
}

export interface IColumnData extends IServerListData {
  tasks: Array<IServerTaskData>;
}

export interface IServerTaskData {
  badges: BadgesTypes;
  cardRole: null;
  checkItemRole: null;
  closed: boolean;
  cover: CoverType;
  dateLastActivity: string;
  desc: string;
  descData: { emoji: {} };
  due: null;
  dueCopmleted: boolean;
  dueReminder: null;
  id: string;
  idAttachmentCover: null;
  idBoard: string;
  idChecklist: [];
  idLabels: [];
  idList: string;
  idMembers: [];
  idMembersVoted: [];
  isShort: 100;
  isTempate: boolean;
  labels: [];
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: null;
  subscribed: boolean;
  url: string;
}

type BadgesTypes = {
  attachments: number;
  attachmentsByType: {
    trello: {
      board: number;
      card: number;
    };
  };
  checkItems: number;
  checkItemsChecked: number;
  checkItemsEarlistDue: number;
  comments: number;
  description: boolean;
  due: null;
  dueCopmleted: boolean;
  fogbugz: string;
  location: boolean;
  start: null;
  subscribed: boolean;
  viewingMemberVoted: boolean;
  votes: number;
};

type CoverType = {
  brightness: string;
  color: null;
  idAttachment: null;
  idPlugin: null;
  idUploadedBackground: null;
  size: string;
};
