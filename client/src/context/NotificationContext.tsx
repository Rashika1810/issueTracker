import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";
import { socket } from "../socket";

interface NotificationContextType {
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext =
  createContext(
    {} as NotificationContextType
  );

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unreadCount, setUnreadCount] =
    useState(0);

  const refreshNotifications =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await api.get(
          "/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const unread =
          res.data.notifications.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (n: any) => !n.isRead
          ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshNotifications();

    socket.on(
      "notification",
      () => {
        setUnreadCount(
          (prev) => prev + 1
        );
      }
    );

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications =
  () =>
    useContext(
      NotificationContext
    );