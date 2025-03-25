import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Notification {  // represents single notification
  id: string;
  message: string;
  timestamp: string;
  type: string;
  link: string;
  profilePhoto?: string;
  markedasread: boolean;
  seen: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (newNotifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      hydrated: false,

      setNotifications: (newNotifications) => {
        const updatedNotifications = newNotifications.map((notif) => ({
          ...notif,
          markedasread: notif.markedasread || false,
          seen: notif.seen || false,
        }));
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.markedasread).length,
        });
      },

      markAsRead: async (id) => {
        try {
          // Send a PATCH request to Mockoon API (3ashan ne3mel update ll notification read wala unread)
          const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markedasread: true }), // Update Mockoon API
          });
      
          if (!response.ok) throw new Error("Failed to update notification in API");
      
          // Update Zustand state after API success
          set((state) => {
            const updatedNotifications = state.notifications.map((notif) =>
              notif.id === id ? { ...notif, markedasread: true, seen: true } : notif
            );
      
            localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter((n) => !n.markedasread).length,
            };
          });
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      },
      
      


      markAsUnread: async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markedasread: false }),
          });

          if (!response.ok) throw new Error("Failed to mark as unread");

          set((state) => {
            const updatedNotifications = state.notifications.map((notif) =>
              notif.id === id ? { ...notif, markedasread: false } : notif
            );
            localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter((n) => !n.markedasread).length,
            };
          });
        } catch (error) {
          console.error("Error marking notification as unread:", error);
        }
      },

      deleteNotification: async (id: string) => {
        try {
          const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {  
            method: "DELETE",
          });
      
          if (!response.ok) {
            throw new Error(`Failed to delete notification: ${response.statusText}`);
          }
      
          set((state) => {
            const updatedNotifications = state.notifications.filter((notif) => notif.id !== id);
            
            //  Store deleted IDs separately in localStorage
            const deletedIds = JSON.parse(localStorage.getItem("deletedNotifications") || "[]");
            deletedIds.push(id);
            localStorage.setItem("deletedNotifications", JSON.stringify(deletedIds));
      
            localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
            return { notifications: updatedNotifications };
          });
        } catch (error) {
          console.error("Error deleting notification:", error);
        }
      },
      

      setHydrated: (hydrated) => {
        if (hydrated) {
          const storedNotifications = localStorage.getItem("notifications");
          if (storedNotifications) {
            set({ notifications: JSON.parse(storedNotifications) });
          }
        }
        set({ hydrated });
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
