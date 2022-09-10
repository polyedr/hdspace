// For client
export interface IBoardForUI extends IBoard {
  organization?: IOrganization | null;
}

export interface IColumnData extends IServerListData {
  tasks: Array<IServerTaskData>;
}

export interface ITaskData extends IServerTaskData {
  members: Array<any>;
}

// From Server
export interface IMembers {
  fullName: string;
  id: string;
  username: string;
}

export interface IOrganization {
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
}

export interface IBoard {
  closed: boolean;
  desc: unknown;
  descData: unknown;
  id: string;
  idEnterprise: any;
  idOrganization: string;
  labelNames: { [key: string]: string } | null;
  limits: unknown;
  name: string;
  pinned: boolean;
  prefs: { [key: string]: string } | null;
  shortUrl: string;
  url: string;
}

export interface IServerListData {
  closed: boolean;
  id: string;
  idBoard: string;
  name: string;
  pos: number;
  softLimit: null;
  subscribed: boolean;
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

export interface BoardTaskTag {
  text: string;
  color: string;
}
