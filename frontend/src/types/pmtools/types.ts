import { DropResult } from '@hello-pangea/dnd';
import { ServerProject } from '..';
import { IServerTaskData } from './board';

export type PlatformActionData = 'PM-TOOLS' | 'MAIN-APP' | 'ALL';

export interface ActionTypePM {
  priority: 'high' | 'medium' | 'low';
  platform: PlatformActionData;
  action: string;
}

// React D&D
export interface DestinationType {
  index: number;
  droppableId: string;
}

export interface UpdateCardIndexType {
  destination: DestinationType;
  source: DropResult['source'];
}

export interface UpdateCardIndexTypeSuccess {
  dest: number;
  removed: IServerTaskData;
  destList: any;
  source: number;
  sourceList: any;
}

export interface MoveCardToListType {
  cardId: number;
  destination: string;
  newPos: number;
}

// Board
export interface CreatorColumnType {
  id?: string;
  project: ServerProject['id'];
  name: string;
}

export interface UpdateColumnIndexTypeSuccess {
  dest: number;
  source: number;
}

export interface UpdateListType {
  listId: number;
  newPos: number;
}
