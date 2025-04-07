export interface Conversation {
  conversationId: number;
  otherUserId: number;
  lastMessageContent: string;
  lastMessageTimestamp: Date;
  unseenMessageCount: number;
}

export interface Message {
  messageId: number;
  senderId: number;
  content: string;
  mediaId: number;
  sentAt: Date;
  readAt: Date;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}
