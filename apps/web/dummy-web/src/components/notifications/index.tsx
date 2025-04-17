import { Notification } from "@ascend/api-client/models";
import { useEffect, useState } from "react";
import { api } from "../../services/auth/handlers";
import styles from "./notifications.module.css";

export const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<number, boolean>>({});

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notificationsList = await api.notification.getNotifications();
      setNotifications(notificationsList);

      setError(null);
    } catch (err) {
      setError(
        `Failed to fetch notifications: ${err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.notification.markNotificationAsRead(notificationId);

      // Update the local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      setError(
        `Failed to mark notification as read: ${err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await api.notification.deleteNotification(notificationId);

      // Update the local state
      setNotifications(
        notifications.filter((notif) => notif.id != notificationId)
      );
    } catch (err) {
      setError(
        `Failed to delete notification: ${err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  const togglePayload = (notificationId: number) => {
    setExpandedPayloads(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId]
    }));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchNotifications}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.notificationsContainer}>
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>You have no notifications.</p>
      ) : (
        <ul className={styles.notificationsList}>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`${styles.notificationItem} ${notification.is_read ? styles.read : styles.unread
                }`}
            >
              <div className={styles.notificationContent}>
                <span className={styles.notificationType}>
                  {notification.type}
                </span>
                <p>{notification.message}</p>
                {notification.payload && (
                  <div className={styles.notificationPayload}>
                    {expandedPayloads[notification.id] ? (
                      <>
                        <pre>{JSON.stringify(notification.payload, null, 2)}</pre>
                        <button
                          className={styles.payloadToggle}
                          onClick={() => togglePayload(notification.id)}
                        >
                          Show less
                        </button>
                      </>
                    ) : (
                      <>
                        <pre className={styles.payloadPreview}>
                          {JSON.stringify(notification.payload).substring(0, 100)}
                          {JSON.stringify(notification.payload).length > 100 ? '...' : ''}
                        </pre>
                        <button
                          className={styles.payloadToggle}
                          onClick={() => togglePayload(notification.id)}
                        >
                          Show more
                        </button>
                      </>
                    )}
                  </div>
                )}
                <span className={styles.timestamp}>
                  {notification.created_at
                    ? new Date(notification.created_at).toLocaleString()
                    : "No date"}
                </span>
              </div>
              {!notification.is_read && (
                <button
                  className={styles.markReadButton}
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </button>
              )}
              <button
                  className={styles.markReadButton}
                  onClick={() => deleteNotification(notification.id)}
                >
                  Delete
                </button>
            </li>
          ))}
        </ul>
      )}
      <button className={styles.refreshButton} onClick={fetchNotifications}>
        Refresh Notifications
      </button>
    </div>
  );
};
