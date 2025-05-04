// src/api/connections.ts
import API from "./api";

export interface SendConnectionRequestPayload {
  userId: number;
  message: string;
}

export interface ConnectionRequestResponse {
  success: boolean;
  data: {
    id: number;
    user_id: number;
    connection_id: number;
    status: "pending";
    request_direction: "outgoing" | "incoming";
    created_at: string;
    updated_at: string;
    message: string;
  };
}

export const sendConnectionRequestAPI = async (
  payload: SendConnectionRequestPayload
): Promise<ConnectionRequestResponse> => {
  const res = await API.post<ConnectionRequestResponse>("/connection/request", payload);
  return res.data;
};

export interface SentInvitation {
    id: number;
    message: string;
    created_at: string;
    user_id: number;
    first_name: string;
    last_name: string;
    profile_picture_id: number | null;
    bio: string | null;
  }
  
  export const getSentInvitationsAPI = async (): Promise<SentInvitation[]> => {
    const res = await API.get<{ success: boolean; data: SentInvitation[] }>(
      "/connection/connections/pending?direction=outgoing"
    );
    return res.data.data;
  };

  export const getReceivedInvitationsAPI = async (): Promise<SentInvitation[]> => {
    const res = await API.get<{ success: boolean; data: SentInvitation[] }>(
      "/connection/connections/pending?direction=incoming"
    );
    return res.data.data;
  };

  // Respond to a connection request (accept or ignore)
export const respondToConnectionRequestAPI = async (
    requestId: number,
    accept: boolean
  ): Promise<{ success: boolean; data: { status: string } }> => {
    const res = await API.put(`/connection/respond/${requestId}`, {
      accept,
    });
    return res.data;
  };

  export interface Connection {
    user_id: number;
    first_name: string;
    last_name: string;
    profile_picture_id: number | null;
    bio: string | null;
    connected_at: string;
  }
  
  export interface GetConnectionsResponse {
    success: boolean;
    data: {
      data: Connection[];
      pagination: {
        total: number;
        page: number;
        limit: number;
      };
    };
  }
  
  export const getConnectionsAPI = async (
    search = "",
    page = 1,
    limit = 10
  ): Promise<GetConnectionsResponse> => {
    const res = await API.get("/connection/connections", {
      params: { search, page, limit },
    });
    return res.data;
  };

  // src/api/connections.ts

export interface SendConnectionRequestPayload {
  userId: number;
  message: string;
}

export interface SendConnectionRequestResponse {
  success: boolean;
  data: {
    id: number;
    user_id: number;
    connection_id: number;
    status: "pending";
    request_direction: "outgoing";
    created_at: string;
    updated_at: string;
    message: string;
  };
}

export const removeConnectionAPI = async (connectionId: number): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await API.delete(`/connection/${connectionId}`);
  return res.data;
};

export interface ConnectionPreferences {
  allow_connection_requests: boolean;
  allow_messages_from: "all" | "connections-only";
  visible_to_public: boolean;
  visible_to_connections: boolean;
  visible_to_network: boolean;
  show_followers: boolean;
}

export interface ConnectionPreferencesResponse {
  success: boolean;
  data: ConnectionPreferences & { user_id: number; updated_at: string };
}

export const upsertConnectionPreferencesAPI = async (
  preferences: ConnectionPreferences
): Promise<ConnectionPreferencesResponse> => {
  const res = await API.put("/connection/preferences", preferences);
  return res.data;
};

// Type for the response
export interface GetConnectionStatusResponse {
  success: boolean;
  data: {
    status: "connected" | "pending" | "notConnected";
  };
}

export const getConnectionStatusAPI = async (
  userId: number
): Promise<GetConnectionStatusResponse> => {
  const res = await API.get(`/connection/connections/status/${userId}`);
  console.log("Fetching connection status for userId:", userId, res.data);
  return res.data;
};

export const followUserAPI = async (userId: number): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await API.post(`/connection/follow/${userId}`);
  return res.data;
};
export const unfollowUserAPI = async (userId: number): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await API.delete(`/connection/follow/${userId}`);
  return res.data;
};

export interface Follower {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture_id: number | null;
  bio: string | null;
}

export interface GetFollowersResponse {
  success: boolean;
  data: {
    data: Follower[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export const getFollowersAPI = async (
  userId: number,
  page = 1,
  limit = 15
): Promise<GetFollowersResponse> => {
  const res = await API.get(`/connection/followers/${userId}`, {
    params: { page, limit },
  });
  return res.data;
};

// API: Check if the logged-in user is following the specified user
export interface GetFollowStatusResponse {
  success: boolean;
  data: {
    isFollowing: boolean;
  };
}

export const getFollowStatusAPI = async (
  userId: number
): Promise<GetFollowStatusResponse> => {
  const res = await API.get(`/connection/follows/status/${userId}`);
  return res.data;
};

export interface BlockUserResponse {
  success: boolean;
  message: string;
}

export const blockUserAPI = async (userId: number): Promise<BlockUserResponse> => {
  const res = await API.post(`/connection/block/${userId}`);
  return res.data;
};

export interface BlockedUser {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture_id: number;
  blocked_at: string;
}

export interface GetBlockedUsersResponse {
  success: boolean;
  data: {
    data: BlockedUser[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export const getBlockedUsersAPI = async (
  page = 1,
  limit = 10
): Promise<GetBlockedUsersResponse> => {
  const res = await API.get("/connection/blocked", {
    params: { page, limit },
  });
  return res.data;
};

export const unblockUserAPI = async (userId: number): Promise<{ success: boolean; message: string }> => {
  const res = await API.delete(`/connection/block/${userId}`);
  return res.data;
};
