// connection.model.ts

export enum ConnectionStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    BLOCKED = 'blocked'
  }
  
  export enum RequestDirection {
    OUTGOING = 'outgoing',
    INCOMING = 'incoming'
  }
  
  export enum NotificationPreference {
    ALL = 'all',
    NONE = 'none',
    CONNECTIONS_ONLY = 'connections_only'
  }
  
  export interface Connection {
    id: number;
    user_id: number;
    connection_id: number;
    status: ConnectionStatus;
    request_direction: RequestDirection;
    message?: string;
    created_at: Date;
    updated_at: Date;
    
    // Optional joined fields
    user?: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
      headline?: string;
    };
  }
  
  export interface Follow {
    id: number;
    follower_id: number;
    following_id: number;
    created_at: Date;
    
    // Optional joined fields
    follower?: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
    };
    following?: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
    };
  }
  
  export interface BlockedUser {
    id: number;
    user_id: number;
    blocked_user_id: number;
    created_at: Date;
    
    // Optional joined fields
    blocked_user?: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
    };
  }
  
  export interface MessageRequest {
    id: number;
    sender_id: number;
    recipient_id: number;
    message: string;
    status: ConnectionStatus;
    created_at: Date;
    updated_at: Date;
    
    // Optional joined fields
    sender?: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
    };
    recipient?: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
    };
  }
  
  export interface UserPreferences {
    user_id: number;
    allow_connection_requests: boolean;
    allow_messages_from: NotificationPreference;
    visible_to_public: boolean;
    visible_to_connections: boolean;
    visible_to_network: boolean;
    updated_at: Date;
  }
  
  // Additional response interfaces
  export interface ConnectionWithUser extends Connection {
    connection_user: {
      id: number;
      first_name: string;
      last_name: string;
      profile_picture_url?: string;
      headline?: string;
    };
  }
  
  export interface PaginatedResults<T> {
    data: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }