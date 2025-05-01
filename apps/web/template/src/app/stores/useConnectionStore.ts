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

}));
