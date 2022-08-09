import { StreamChat, LiteralStringForUnion } from 'stream-chat';

export type TeamAttachmentType = Record<string, unknown>;
export type TeamChannelType = Record<string, unknown>;
export type TeamCommandType = LiteralStringForUnion;
export type TeamEventType = Record<string, unknown>;
export type TeamMessageType = Record<string, unknown>;
export type TeamReactionType = Record<string, unknown>;
export type TeamUserType = { image?: string };

const apiKey = 'jfcd9hhxbwq8';

const client = StreamChat.getInstance<
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType
>(apiKey!, { enableInsights: true, enableWSFallback: true });

export default client;
