import { useOrganization } from "../context/OrganizationContext";
import { Link, useNavigate } from "react-router-dom";

import { useNotifications } from "../context/NotificationContext";

export default function OrganizationDashboard() {
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">{organization.name}</h1>

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
          to="/my-tasks"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          My Tasks
        </Link>
        <Link
          to="/analytics"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Analytics
        </Link>

        <Link
          to="/notifications"
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Notifications
          {unreadCount > 0 && ` (${unreadCount})`}
        </Link>
      </div>
    </div>
  );
}
