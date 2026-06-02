import { useOrganization } from "../context/OrganizationContext";
import { Link, useNavigate } from "react-router-dom";

export default function OrganizationDashboard() {
  const { organization } = useOrganization();
  const navigate = useNavigate();

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        {organization.name}
      </h1>

      <p className="mt-2 text-gray-500">
        Members: {organization?.members?.length}
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate("/projects")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Projects
        </button>
      </div>
      <div className="flex gap-3 mt-4">

  <Link
    to="/organization/members"
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Manage Members
  </Link>
</div>
    </div>
  );
}