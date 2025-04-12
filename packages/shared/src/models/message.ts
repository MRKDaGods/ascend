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
  content: string | null;
  fileUrl: string | null;
  sentAt: Date;
  readAt: Date;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}
