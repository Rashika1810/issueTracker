import { useEffect, useState } from "react";
import { useOrganization } from "../context/OrganizationContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function OrganizationDashboard() {
  const { organization } = useOrganization();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const unread = res.data.notifications.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (notification: any) => !notification.isRead
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        {organization.name}
      </h1>

      <p className="mt-2 text-gray-500">
        Members: {organization.members.length}
      </p>

      <div className="mt-8 flex gap-4 flex-wrap">
        <button
          onClick={() => navigate("/projects")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Projects
        </button>

        <Link
          to="/organization/members"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Manage Members
        </Link>

        <Link
          to="/notifications"
          className="relative bg-yellow-500 text-white px-4 py-2 rounded"
        >
          🔔 Notifications

          {unreadCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-600
                text-white
                text-xs
                rounded-full
                px-2
              "
            >
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}