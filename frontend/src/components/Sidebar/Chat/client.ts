import { STREAM_CHAT_CLIENT_ID } from '@Src/config/settings';
import { StreamChat, LiteralStringForUnion } from 'stream-chat';

export type TeamAttachmentType = Record<string, unknown>;
export type TeamChannelType = Record<string, unknown>;
export type TeamCommandType = LiteralStringForUnion;
export type TeamEventType = Record<string, unknown>;
export type TeamMessageType = Record<string, unknown>;
export type TeamReactionType = Record<string, unknown>;
export interface TeamUserType {
  image?: string;
}

const client = StreamChat.getInstance<
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType
>(STREAM_CHAT_CLIENT_ID, { enableInsights: true, enableWSFallback: true });

export default client;
