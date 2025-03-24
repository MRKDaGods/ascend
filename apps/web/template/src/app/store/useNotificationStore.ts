import { create } from "zustand";

interface Notification {
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
}

export const useNotificationStore = create<NotificationStore>((set) => {
  const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");

  return {
    notifications: storedNotifications,
    unreadCount: storedNotifications.filter((n: any) => !n.markedasread).length,

    setNotifications: (newNotifications) => {
      const updatedNotifications = newNotifications.map((notif) => {
        const existingNotif = storedNotifications.find((n: any) => n.id === notif.id);
        return existingNotif
          ? { ...notif, markedasread: existingNotif.markedasread, seen: existingNotif.seen }
          : { ...notif, markedasread: false, seen: false };
      });

      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      set({ notifications: updatedNotifications, unreadCount: updatedNotifications.filter((n) => !n.markedasread).length });
    },

    markAsRead: (id) => {
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
    
      console.log("Marked as read:", id); // Debugging
    },
    
    markAsUnread: async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markedasread: false }), // Update API
        });
    
        if (!response.ok) throw new Error("Failed to mark as unread");
    
        // ✅ Update Zustand state & localStorage
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
        console.log("Deleting notification with ID:", id); // Debugging
    
        const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
          method: "DELETE",
        });
    
        if (!response.ok) {
          throw new Error(`Failed to delete notification: ${response.statusText}`);
        }
    
        console.log("Notification deleted successfully!"); // Debugging
    
        // ✅ Remove from Zustand & localStorage
        set((state) => {
          const updatedNotifications = state.notifications.filter((notif) => notif.id !== id);
          localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
          return { notifications: updatedNotifications };
        });
    
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    
  };
});