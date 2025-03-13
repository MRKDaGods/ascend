"use client";
import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, Trash2, EyeOff, Bell } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  profilePhoto: string;
  link: string;
  read: boolean;
  type: "like" | "comment" | "mention" | "follow";
}

const NotificationCard = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/notifications")
      .then((response) => response.json())
      .then((data) => {
        const savedReadNotifications = JSON.parse(localStorage.getItem("readNotifications") || "{}");
        const deletedNotifications = new Set(JSON.parse(localStorage.getItem("deletedNotifications") || "[]"));

        const updatedData = data
          .filter((notification: Notification) => !deletedNotifications.has(notification.id))
          .map((notification: Notification) => ({
            ...notification,
            read: savedReadNotifications[notification.id] ?? false,
          }));

        setNotifications(updatedData);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "myPosts") return notification.type === "like" || notification.type === "comment";
    if (filter === "mentions") return notification.type === "mention";
    if (filter === "follow") return notification.type === "follow";
    return false;
  });

  const unseenCount = filteredNotifications.filter((notif) => !notif.read).length;

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
    const savedReadNotifications = JSON.parse(localStorage.getItem("readNotifications") || "{}");
    savedReadNotifications[id] = !savedReadNotifications[id];
    localStorage.setItem("readNotifications", JSON.stringify(savedReadNotifications));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    const deletedNotifications = JSON.parse(localStorage.getItem("deletedNotifications") || "[]");
    deletedNotifications.push(id);
    localStorage.setItem("deletedNotifications", JSON.stringify(deletedNotifications));
  };

  return (
    <div className="w-full max-w-[28rem] bg-white shadow-lg rounded-lg p-4 relative mt-2 h-[32rem] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold flex items-center text-gray-800">
          <Bell className="w-5 h-5 mr-2 text-gray-500" />
          Notifications
        </h2>
        {unseenCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unseenCount}
          </span>
        )}
      </div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1 text-sm rounded-full ${filter === "all" ? "bg-green-700 text-black" : "bg-gray-400"}`}>All</button>
        <button onClick={() => setFilter("myPosts")} className={`px-3 py-1 text-sm rounded-full ${filter === "myPosts" ? "bg-green-700 text-black" : "bg-gray-400"}`}>My Posts</button>
        <button onClick={() => setFilter("mentions")} className={`px-3 py-1 text-sm rounded-full ${filter === "mentions" ? "bg-green-700 text-black" : "bg-gray-400"}`}>Mentions</button>
        <button onClick={() => setFilter("follow")} className={`px-3 py-1 text-sm rounded-full ${filter === "follow" ? "bg-green-700 text-black" : "bg-gray-400"}`}>Follows</button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto pr-2">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No new notifications</p>
        ) : (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="relative flex items-center justify-between p-2 border-b last:border-b-0 cursor-pointer w-full">
              <a href={notification.link} onClick={() => toggleReadStatus(notification.id)} className={`flex items-center flex-1 w-full ${notification.read ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                <img src={notification.profilePhoto} alt="User profile" className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? "text-gray-500" : "text-black font-semibold"}`}>{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
              </a>
              <div className="relative">
                <MoreVertical className="cursor-pointer text-gray-700" onClick={() => setOpenMenu(openMenu === notification.id ? null : notification.id)} />
                {openMenu === notification.id && (
                  <div id={`menu-${notification.id}`} className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border z-50">
                    <button className="w-full text-left px-3 py-1 text-gray-600 hover:bg-gray-500" onClick={() => toggleReadStatus(notification.id)}>Mark as {notification.read ? "Unread" : "Read"}</button>
                    <button className="w-full text-left px-3 py-1 text-red-600 hover:bg-gray-500" onClick={() => deleteNotification(notification.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
