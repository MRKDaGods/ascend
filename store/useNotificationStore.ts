import { create } from "zustand";

// Define Notification type
interface Notification {
  id: string;
  message: string;
  profilePhoto?: string; // Make sure this is included
  timestamp?: string; // Make sure this is included
  markedasread: boolean;
  type: "like" | "comment" | "mention" | "follow"; 
}


// Define Store Type
interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  setNotifications: (notifications) => {
    set({ notifications });
    localStorage.setItem("notifications", JSON.stringify(notifications)); // ✅ Persist in localStorage
  },

  markAsRead: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.map((notif) =>
        notif.id === id ? { ...notif, markedasread: !notif.markedasread } : notif
      );
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // ✅ Save read state
      return { notifications: updatedNotifications };
    });
  },

  deleteNotification: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.filter((notif) => notif.id !== id);
      
      // ✅ Store deleted notification IDs
      const deletedIds = localStorage.getItem("deletedNotifications");
      const deletedSet = new Set(deletedIds ? JSON.parse(deletedIds) : []);
      deletedSet.add(id);
      localStorage.setItem("deletedNotifications", JSON.stringify([...deletedSet]));

      localStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // ✅ Persist update
      return { notifications: updatedNotifications };
    });
  },
}));
