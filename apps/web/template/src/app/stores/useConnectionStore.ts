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
    followUserAPI,
    getFollowersAPI,
    Follower,
    ConnectionPreferences,
    upsertConnectionPreferencesAPI,
    getConnectionStatusAPI, 
    GetConnectionStatusResponse,    
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

  fetchTopConnections: (limit?: number) => Promise<void>;
  removeConnection: (connectionId: number) => Promise<void>;

  followUser: (userId: number) => Promise<void>;

  followers: Follower[];
  fetchFollowers: (userId: number, page?: number, limit?: number) => Promise<void>;

  connectionPreferences: ConnectionPreferences | null;
  setConnectionPreferences: (prefs: ConnectionPreferences) => void;
  saveConnectionPreferences: (prefs: ConnectionPreferences) => Promise<void>;

  connectionStatuses: Record<number, "connected" | "pending" | "notConnected">;
  fetchConnectionStatus: (userId: number) => Promise<void>;

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
  
  fetchTopConnections: async (limit = 5) => {
    try {
      const res = await getConnectionsAPI("", 1, limit);
      set({ connections: res.data.data }); // reuse connections field
    } catch (err) {
      console.error("❌ Failed to fetch top connections", err);
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

  followUser: async (userId) => {
    try {
      const res = await followUserAPI(userId);
      console.log("✅ Followed user:", res.message);
    } catch (err) {
      console.error("❌ Failed to follow user", err);
    }
  },

  followers: [],

  fetchFollowers: async (userId, page = 1, limit = 10) => {
    try {
      const res = await getFollowersAPI(userId, page, limit);
      set({ followers: res.data.data });
    } catch (err) {
      console.error("❌ Failed to fetch followers", err);
    }
  },

  connectionPreferences: null,

  setConnectionPreferences: (prefs) => set({ connectionPreferences: prefs }),

  saveConnectionPreferences: async (prefs) => {
    try {
      const res = await upsertConnectionPreferencesAPI(prefs);
      set({ connectionPreferences: res.data });
      console.log("✅ Preferences saved");
    } catch (err) {
      console.error("❌ Failed to save preferences", err);
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

}));
