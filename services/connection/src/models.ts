// Mock models for testing
export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

export interface Connection {
  id: number;
  user_id: number;
  connection_id: number;
  status: ConnectionStatus;
  request_direction: 'incoming' | 'outgoing';
  created_at: Date;
  updated_at: Date;
  message?: string;
}

export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
}

export interface BlockedUser {
  id: number;
  user_id: number;
  blocked_user_id: number;
  created_at: Date;
}

export interface MessageRequest {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  status: ConnectionStatus;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  user_id: number;
  allow_connection_requests: boolean;
  allow_messages_from: 'all' | 'none' | 'connections_only';
  visible_to_public: boolean;
  visible_to_connections: boolean;
  visible_to_network: boolean;
  show_followers?: boolean;
  updated_at: Date;
}