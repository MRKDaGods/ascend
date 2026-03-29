export interface Conversation {
  conversationId: number;
  otherUserId: number;
  otherUserFullName: string;
  otherUserProfilePictureUrl: string | null;
  isBlocked: boolean;
  lastMessageContent: string;
  lastMessageTimestamp: Date;
  unseenMessageCount: number;
}

export interface Message {
  messageId: number;
  senderId: number;
  content: string | null;
  fileUrl: string | null;
  fileType: string | null;
  sentAt: Date;
  readAt: Date;
  isRead: boolean;
}
