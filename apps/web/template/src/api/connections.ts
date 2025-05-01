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