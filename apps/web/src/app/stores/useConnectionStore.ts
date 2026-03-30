// src/stores/useConnectionStore.ts
import { create } from "zustand";
import {
    getSentInvitationsAPI,
    SentInvitation,
    sendConnectionRequestAPI,
    SendConnectionRequestPayload,
    getReceivedInvitationsAPI,
    respondToConnectionRequestAPI,
    getConnectionsAPI,
    Connection,    
    removeConnectionAPI,
    getConnectionStatusAPI, 
    GetConnectionStatusResponse,
    followUserAPI,
    unfollowUserAPI,
    getFollowersAPI, 
    Follower,
    getFollowStatusAPI,
    blockUserAPI,
    getBlockedUsersAPI,
    BlockedUser,
    GetBlockedUsersResponse, 
    unblockUserAPI,
    sendMessageRequestAPI,
    SendMessageRequestPayload,
    getMessageRequestsAPI, 
    MessageRequest
    } from "@/api/connections";

interface ConnectionStore {
  isSending: boolean;
  sentInvitations: SentInvitation[];
  sendConnectionRequest: (payload: SendConnectionRequestPayload) => Promise<void>;
  fetchSentInvitations: () => Promise<void>;
  receivedInvitations: SentInvitation[];
  fetchReceivedInvitations: () => Promise<void>;

  InvitationWithdrawnPopupOpen: boolean;
  setInvitationWithdrawnPopupOpen: (open: boolean) => void;

  respondToConnectionRequest: (
    requestId: number,
    accept: boolean
  ) => Promise<void>;

  connections: Connection[];
  fetchConnections: (search?: string) => Promise<void>;

  fetchTopInvitations: (limit?: number) => Promise<void>;
  removeConnection: (connectionId: number) => Promise<void>;

  connectionStatuses: Record<number, "connected" | "pending" | "notConnected">;
  fetchConnectionStatus: (userId: number) => Promise<void>;

  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  followers: Follower[];
  fetchFollowers: (userId: number, page?: number, limit?: number) => Promise<void>;

  followStatuses: Record<number, boolean>; // userId -> isFollowing
  fetchFollowStatus: (userId: number) => Promise<void>;

  blockUser: (userId: number) => Promise<void>;
  blockedUsers: BlockedUser[];
  fetchBlockedUsers: (page?: number, limit?: number) => Promise<void>;
  unblockUser: (userId: number) => Promise<void>;

  sendMessageRequest: (payload: SendMessageRequestPayload) => Promise<void>;
  messageRequests: MessageRequest[];
  fetchMessageRequests: () => Promise<void>;

}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  isSending: false,

  sendConnectionRequest: async (payload) => {
    set({ isSending: true });
    try {
      const res = await sendConnectionRequestAPI(payload);
      console.log("✅ Connection request sent:", res);
    } catch (err) {
      console.error("❌ Error sending connection request:", err);
    } finally {
      set({ isSending: false });
    }
  },
  sentInvitations: [],

  fetchSentInvitations: async () => {
    try {
      const data = await getSentInvitationsAPI();
      set({ sentInvitations: data });
    } catch (err) {
      console.error("❌ Error fetching sent invitations:", err);
    }
  },

  receivedInvitations: [],

  fetchReceivedInvitations: async () => {
    try {
      const data = await getReceivedInvitationsAPI();
      set({ receivedInvitations: data });
    } catch (err) {
      console.error("❌ Error fetching received invitations:", err);
    }
  },
  InvitationWithdrawnPopupOpen: false,
  setInvitationWithdrawnPopupOpen: (open) => set({ InvitationWithdrawnPopupOpen: open }),

  respondToConnectionRequest: async (requestId, accept) => {
    try {
      await respondToConnectionRequestAPI(requestId, accept);
      // Refresh received list after action
      await get().fetchReceivedInvitations();
    } catch (err) {
      console.error("❌ Failed to respond to connection request", err);
    }
  },

  connections: [],

  fetchConnections: async (search = "") => {
    try {
      const res = await getConnectionsAPI(search);
      set({ connections: res.data.data });
    } catch (err) {
      console.error("❌ Failed to fetch connections", err);
    }
  },
  
  fetchTopInvitations: async (limit = 5) => {
    try {
      const all = await getReceivedInvitationsAPI();
      set({ receivedInvitations: all.slice(0, limit) });
    } catch (err) {
      console.error("❌ Failed to fetch top invitations", err);
    }
  },
  
  removeConnection: async (connectionId) => {
    try {
      await removeConnectionAPI(connectionId);
      const updated = get().connections.filter(
        (c) => c.user_id !== connectionId
      );
      set({ connections: updated });
    } catch (err) {
      console.error("❌ Failed to remove connection", err);
    }
  },
  
  connectionStatuses: {} as Record<number, "connected" | "pending" | "notConnected">,
  fetchConnectionStatus: async (userId: number) => {
    try {
      const res = await getConnectionStatusAPI(userId);
      set((state) => ({
        connectionStatuses: {
          ...state.connectionStatuses,
          [userId]: res.data.status,
        },
      }));
    } catch (err) {
      console.error(`❌ Failed to fetch connection status for user ${userId}`, err);
    }
  },

  followUser: async (userId) => {
    try {
      const res = await followUserAPI(userId);
      console.log("✅ Followed user:", res.message);
    } catch (err) {
      console.error("❌ Failed to follow user", err);
    }
  },  
  unfollowUser: async (userId) => {
    try {
      const res = await unfollowUserAPI(userId);
      console.log("✅ Unfollowed user:", res.message);
    } catch (err) {
      console.error("❌ Failed to unfollow user", err);
    }
  },
  followers: [],

  fetchFollowers: async (userId, page = 1, limit = 15) => {
    try {
      const res = await getFollowersAPI(userId, page, limit);
      set({ followers: res.data.data });
    } catch (err) {
      console.error(`❌ Failed to fetch followers for user ${userId}`, err);
    }
  },

  followStatuses: {},

  fetchFollowStatus: async (userId: number) => {
    try {
      const res = await getFollowStatusAPI(userId);
      set((state) => ({
        followStatuses: {
          ...state.followStatuses,
          [userId]: res.data.isFollowing,
        },
      }));
    } catch (err) {
      console.error(`❌ Failed to fetch follow status for user ${userId}`, err);
    }
  },

  blockUser: async (userId) => {
    try {
      const res = await blockUserAPI(userId);
      console.log(`✅ User ${userId} blocked:`, res.message);
    } catch (err) {
      console.error(`❌ Failed to block user ${userId}`, err);
    }
  },

  blockedUsers: [],

  fetchBlockedUsers: async (page = 1, limit = 10) => {
    try {
      const res = await getBlockedUsersAPI(page, limit);
      set({ blockedUsers: res.data.data });
    } catch (err) {
      console.error("❌ Failed to fetch blocked users:", err);
    }
  },

  unblockUser: async (userId) => {
    try {
      const res = await unblockUserAPI(userId);
      console.log(`✅ User ${userId} unblocked:`, res.message);
      const updated = get().blockedUsers.filter((u) => u.user_id !== userId);
      set({ blockedUsers: updated });
    } catch (err) {
      console.error(`❌ Failed to unblock user ${userId}`, err);
    }
  },
  
  sendMessageRequest: async (payload) => {
    try {
      const res = await sendMessageRequestAPI(payload);
      console.log("✅ Message request sent:", res);
    } catch (err) {
      console.error("❌ Error sending message request:", err);
    }
  },

  messageRequests: [],

  fetchMessageRequests: async () => {
    try {
      const data = await getMessageRequestsAPI();
      set({ messageRequests: data });
    } catch (err) {
      console.error("❌ Error fetching message requests:", err);
    }
  },
  
}));
