import { DefaultRootState } from 'react-redux';

export type ChatState = {
  client: ChatClient;
  session: ChatSession;
  error: ChatResponseError | Error | null;
  msg: string | null;
  authenticated: boolean;
  authPending: boolean;
  loadingMessages: boolean;
  pagination: boolean;
  markdown: ChatMarkdownResponse['rawContent'];
  aggregatedUserPresences: ChatPresences;
};

export interface ChatRootState extends DefaultRootState {
  chatReducer: ChatState;
}

// ******** Chat API types ********

// ToDo:
// export type ChatUsersResponse = {};

interface AuthLoginBase {
  realm?: string;
  username?: string;
}
export interface AuthParams extends AuthLoginBase {
  apiKey?: string;
}

export interface LoginParams extends AuthLoginBase {
  password?: string;
}

// ToDo: define this type
export type ChatClient = any;

// Search params docs:- https://zulip.com/help/search-for-messages
type ChatNarrow<T, U> = {
  operator: T;
  operand: U;
  negated?: true;
}[];

export type ChatQuery = {
  anchor?: number | 'newest' | 'oldest' | 'first_unread';
  numberBefore: number;
  numberAfter: number;
  narrow?: ChatNarrow<string, number>;
  clientGravatar?: boolean;
  applyMarkdown?: boolean;
};

export type SendMessageParams = {
  to: string;
  type: 'stream' | 'private';
  topic: string;
  content: string;
  queueId: number;
  localId: number;
};

type DisplayRecipient = {
  email: string;
  fullName: string;
  id: number;
  isMirrorDummy: boolean;
};

type ChatReactions = {
  emojiCode: any;
  emojiName: string;
  reactionType: {
    unicodeEmoji: string;
    realmEmoji: number;
    zulipExtraEmoji: any;
  };
  userId: number;
}[];

export interface ChatUser {
  avatarUrl: string;
  avatarVersion?: number;
  email: string;
  fullName: string;
  isAdmin: boolean;
  isOwner?: boolean;
  isGuest?: boolean;
  isBot?: boolean;
  isActive?: boolean;
  timezone?: string;
  dateJoined?: string;
  maxMessageId: number; // Deprecated: use GET /messages
  userId: number;
  deliveryEmail: string;
  profileData: {
    value: string;
    renderedValue: string;
  };
}

export interface ChatMessage {
  [index: string]: any;
  avatarUrl: string;
  client: string;
  content: string;
  markdown?: string;
  contentType: 'text/html' | 'text/x-markdown';
  displayRecipient: string | DisplayRecipient[];
  id: number;
  isMeMessage: boolean;
  recipientId: number;
  senderEmail: string;
  senderFullName: string;
  senderId: number;
  senderRealmStr: string;
  subject: string;
  topic: string;
  timestamp: number | string;
  topicLinks?: [];
  type: 'stream' | 'private';
  flags: string[];
  reactions: [] | ChatReactions;
  streamId: number;
  submessages: [];
  lastEditTimestamp?: number;
  matchContent?: string;
  isChecked: boolean;
  queueId?: number;
  localId?: number;
}

export interface UpdateMessageProps {
  id: ChatMessage['id'];
  content: ChatMessage['content'];
  flags: ChatMessage['flags'];
  lastEditTimestamp: ChatMessage['lastEditTimestamp'];
}

export interface ChatMessages {
  [index: number]: ChatMessage;
}

export interface ChatSubscription {
  [index: string]: any;
  audibleNotifications: boolean | null;
  color: string;
  description: string;
  desktopNotifications: boolean | null;
  emailAddress: string;
  inviteOnly: boolean;
  isMuted: boolean;
  name: string;
  pinToTop: boolean;
  pushNotifications: boolean | null;
  role: number;
  streamId: number;
  subscribers: number[];
  renderedDescription?: string;
  dateCreated: number;
  emailNotifications: boolean | null;
  wildcardMentionsNotify: boolean | null;
  streamPostPolicy: number;
  isWebPublic?: boolean;
  messageRetentionDays?: number | null | -1;
  historyPublicToSubscribers?: boolean;
  firstMessageId: number;
  streamWeeklyTraffic?: number | null;
  inHomeView?: boolean;
  isAnnouncementOnly?: boolean;
  messages: ChatMessages;
}

export interface ChatSubscriptions {
  [index: number]: ChatSubscription;
}

export interface ChatResponseBase {
  msg: string;
}

export interface ChatResponseSuccess extends ChatResponseBase {
  result: 'success';
}

export interface ChatResponseError extends ChatResponseBase {
  result: 'error';
  code: string;
  stream?: string;
  message?: string;
  name?: string;
}

export interface ChatUserResponse extends ChatUser, ChatResponseSuccess {}

export interface SendChatMessageResponse extends ChatResponseSuccess {
  id: number;
  deliverAt?: number;
}

export interface ChatMessagesResponse extends ChatResponseSuccess {
  anchor: number;
  foundNewest: boolean;
  foundAnchor: boolean;
  historyLimited: boolean;
  messages: ChatMessage[];
}

export interface ChatMessagesFlagResponse extends ChatResponseSuccess {
  messages: number[];
}

export interface ChatMarkdownResponse extends ChatResponseSuccess {
  rawContent: ChatMessage['markdown'];
}

export interface ChatSubListResponse extends ChatResponseSuccess {
  subscriptions: ChatSubscription[];
}

export interface ChatSubResponse extends ChatResponseSuccess {
  subscribed: { [propName: string]: string };
  alreadySubscribed: { [propName: string]: string };
}

export interface ChatSettings {
  streamNameMaxLength: number;
  streamDescriptionMaxLength: number;
  zulipFeatureLevel: number;
  zulipVersion: string;
  queueId: number;
  lastEventId: number;
  maxMessageId: number;
}

export interface ChatStatus {
  userStatus: {
    [index: number]: {
      statusText?: string;
      away: boolean;
      activeTimestamp: number;
    };
  };
}

export type ChatTimestamp = number;

export interface ChatPresenceRaw {
  idleTimestamp?: ChatTimestamp;
  activeTimestamp?: ChatTimestamp;
}

export interface ChatPresencesRaw {
  [index: number]: ChatPresenceRaw;
  serverTimestamp: ChatTimestamp;
}

export interface ChatPresenceSuccess extends ChatResponseSuccess {
  presences: ChatPresencesRaw;
  serverTimestamp: ChatTimestamp;
}

export interface ChatPresenceInfo {
  client: string;
  status: string;
  timestamp: ChatTimestamp;
  pushable: boolean;
}

export type ChatPresencesInfo = {
  [index: string]: ChatPresenceInfo;
};

export interface ChatPresence {
  status: string;
  lastActive: ChatTimestamp;
}

export type ChatPresences = Map<number, ChatPresence>;

export interface ChatRealm {
  realmAddEmojiByAdminsOnly: boolean;
  realmAllowEditHistory: boolean;
  realmAllowMessageDeleting: boolean;
  realmBotCreationPolicy: number;
  realmCreateStreamPolicy: number;
  realmInviteToStreamPolicy: number;
  realmDefaultLanguage: string;
  realmDefaultTwentyFourHourTime: boolean;
  realmDescription: string;
  realmDigestEmailsEnabled: boolean;
  realmDisallowDisposableEmailAddresses: boolean;
  realmEmailAddressVisibility: number;
  realmEmailChangesDisabled: boolean;
  realmInviteRequired: boolean;
  realmInviteByAdminsOnly: boolean;
  realmInlineImagePreview: boolean;
  realmInlineUrlEmbedPreview: boolean;
  realmMandatoryTopics: boolean;
  realmMessageRetentionDays: number;
  realmName: string;
  realmNameChangesDisabled: boolean;
  realmAvatarChangesDisabled: boolean;
  realmEmailsRestrictedToDomains: boolean;
  realmSendWelcomeEmails: boolean;
  realmMessageContentAllowedInEmailNotifications: boolean;
  realmVideoChatProvider: number;
  realmWaitingPeriodThreshold: number;
  realmDigestWeekday: number;
  realmPrivateMessagePolicy: number;
  realmUserGroupEditPolicy: number;
  realmDefaultCodeBlockLanguage: null | string;
  realmMessageContentDeleteLimitSeconds: number;
  realmWildcardMentionPolicy: number;
  realmAuthenticationMethods: {
    Google: boolean;
    Email: boolean;
    GitHub: boolean;
    SAML: boolean;
    GitLab: boolean;
  };
  realmAllowMessageEditing: boolean;
  realmAllowCommunityTopicEditing: boolean;
  realmMessageContentEditLimitSeconds: number;
  realmCommunityTopicEditingLimitSeconds: number;
  realmPresenceDisabled: boolean;
  realmIconUrl: string;
  realmIconSource: 'D' | 'U';
  maxIconFileSize: number;
  realmLogoUrl: string;
  realmLogoSource: 'D' | 'U';
  realmNightLogoUrl: string;
  realmNightLogoSource: 'D' | 'U';
  maxLogoFileSize: number;
  realmBotDomain: string;
  realmUri: string;
  realmAvailableVideoChatProviders: {
    disabled: {
      name: string;
      id: number;
    };
    jitsiMeet: {
      name: string;
      id: number;
    };
    zoom: {
      name: string;
      id: number;
    };
  };
  settingsSendDigestEmails: boolean;
  realmIsZephyrMirrorRealm: boolean;
  realmEmailAuthEnabled: boolean;
  realmPasswordAuthEnabled: boolean;
  realmPushNotificationsEnabled: boolean;
  realmUploadQuota: number;
  realmPlanType: number;
  zulipPlanIsNotLimited: boolean;
  upgradeTextForWideOrganizationLogo: string;
  realmDefaultExternalAccounts: {
    twitter: {
      text: string;
      urlPattern: string;
      name: string;
      hint: string;
    };
    github: {
      text: string;
      urlPattern: string;
      name: string;
      hint: string;
    };
  };
  jitsiServerUrl: string;
  developmentEnvironment: boolean;
  serverGeneration: number;
  passwordMinLength: number;
  passwordMinGuesses: number;
  maxFileUploadSizeMib: number;
  maxAvatarFileSizeMib: number;
  serverInlineImagePreview: boolean;
  serverInlineUrlEmbedPreview: boolean;
  serverAvatarChangesDisabled: boolean;
  serverNameChangesDisabled: boolean;
  realmNotificationsStreamId: number;
  realmSignupNotificationsStreamId: number;
  crossRealmBots: {
    email: string;
    userId: number;
    avatarVersion: number;
    isAdmin: boolean;
    isOwner: boolean;
    isGuest: boolean;
    isBot: boolean;
    fullName: string;
    timezone: string;
    isActive: boolean;
    dateJoined: Date;
    avatarUrl: string;
    botType: null | 1 | 2 | 3 | 4;
    isCrossRealmBot: boolean;
    botOwnerId: null;
  }[];
  realmNonActiveUsers: [];
}

export interface ChatEventQueueResponseBase
  extends ChatResponseSuccess,
    ChatPresencesRaw,
    ChatStatus,
    ChatRealm,
    ChatUser,
    ChatSettings {
  [index: string]: any;
  avatarSource: 'G' | 'U';
  enterSends: boolean;
  canCreateStreams: boolean;
  canSubscribeOtherUsers: boolean;
}

export interface ChatEventQueueResponse extends ChatEventQueueResponseBase {
  subscriptions: ChatSubscription[];
  streams: ChatSubscription[];
}

export interface ChatSession extends ChatEventQueueResponseBase {
  subscriptions: ChatSubscriptions;
  streams: ChatSubscriptions;
}

export interface ChatAuthResponse extends ChatResponseSuccess {
  apiKey: string;
  email: string;
}
