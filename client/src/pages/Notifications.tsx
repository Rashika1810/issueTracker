import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { useNotifications } from "../context/NotificationContext";
interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { refreshNotifications } = useNotifications();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchNotifications();
      await refreshNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchNotifications();
      await refreshNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>

        <button
          onClick={markAllRead}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Mark All Read
        </button>
      </div>

      <div className="mb-4">
        Unread Notifications:
        <span className="font-bold ml-2">{unreadCount}</span>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => markAsRead(notification._id)}
            className={`border rounded p-4 cursor-pointer ${
              notification.isRead ? "bg-white" : "bg-blue-50"
            }`}
          >
            <div>{notification.message}</div>

            <div className="text-sm text-gray-500 mt-2">
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
