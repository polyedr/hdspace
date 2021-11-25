export type IBoard = any;

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
