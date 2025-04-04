import { Notification } from "@ascend/api-client/models";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "../../api";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (newNotifications: Notification[]) => void;
  markAsRead: (id: number) => void;
  markAsUnread: (id: number) => void;
  deleteNotification: (id: number) => void;
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
          is_read: notif.is_read || false,
          seen: false, // ?? notif.seen || false,
        }));
        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        );
        set({
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.is_read)
            .length,
        });
      },

      markAsRead: async (id) => {
        api.notification
          .markNotificationAsRead(id)
          .then(() => {
            // Update Zustand state after API success
            set((state) => {
              const updatedNotifications = state.notifications.map((notif) =>
                notif.id === id
                  ? { ...notif, is_read: true /*seen: true*/ }
                  : notif
              );

              localStorage.setItem(
                "notifications",
                JSON.stringify(updatedNotifications)
              );

              return {
                notifications: updatedNotifications,
                unreadCount: updatedNotifications.filter((n) => !n.is_read)
                  .length,
              };
            });
          })
          .catch((error) => {
            console.error("Error marking notification as read:", error);
          });
      },

      markAsUnread: async (id) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/notifications/${id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ is_read: false }),
            }
          );

          if (!response.ok) throw new Error("Failed to mark as unread");

          set((state) => {
            const updatedNotifications = state.notifications.map((notif) =>
              notif.id === id ? { ...notif, is_read: false } : notif
            );
            localStorage.setItem(
              "notifications",
              JSON.stringify(updatedNotifications)
            );
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter((n) => !n.is_read)
                .length,
            };
          });
        } catch (error) {
          console.error("Error marking notification as unread:", error);
        }
      },

      deleteNotification: async (id) => {
        try {
          throw new Error("Not implemented yet");
          // const response = await fetch(
          //   `http://localhost:5000/api/notifications/${id}`,
          //   {
          //     method: "DELETE",
          //   }
          // );

          // if (!response.ok) {
          //   throw new Error(
          //     `Failed to delete notification: ${response.statusText}`
          //   );
          // }

          // set((state) => {
          //   const updatedNotifications = state.notifications.filter(
          //     (notif) => notif.id !== id
          //   );

          //   //  Store deleted IDs separately in localStorage
          //   const deletedIds = JSON.parse(
          //     localStorage.getItem("deletedNotifications") || "[]"
          //   );
          //   deletedIds.push(id);
          //   localStorage.setItem(
          //     "deletedNotifications",
          //     JSON.stringify(deletedIds)
          //   );

          //   localStorage.setItem(
          //     "notifications",
          //     JSON.stringify(updatedNotifications)
          //   );
          //   return { notifications: updatedNotifications };
          // });
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
