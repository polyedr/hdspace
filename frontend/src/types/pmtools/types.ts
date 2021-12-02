import { DropResult } from 'react-beautiful-dnd';
import { ServerProject } from '../types';
import { IServerTaskData } from './board';

export type PlatformActionData = 'PM-TOOLS' | 'MAIN-APP' | 'ALL';

export interface ActionTypePM {
  priority: 'high' | 'medium' | 'low';
  platform: PlatformActionData;
  action: string;
}

// Chat
export interface AuthParams {
  apiKey?: string;
  realm: string;
  username: string;
  password?: string;
}

export type IStream = any;
export type IMessageZulip = any;

export type ChatClient = any;

// React D&D
export type DestinationType = {
  index: number;
  droppableId: string;
};

export type UpdateCardIndexType = {
  destination: DestinationType;
  source: DropResult['source'];
};

export type UpdateCardIndexTypeSuccess = {
  dest: number;
  removed: IServerTaskData;
  destList: any;
  source: number;
  sourceList: any;
};

export type MoveCardToListType = {
  cardId: number;
  destination: string;
  newPos: number;
};

// Board
export interface CreatorColumnType {
  id?: string;
  project: ServerProject['id'];
  name: string;
}
