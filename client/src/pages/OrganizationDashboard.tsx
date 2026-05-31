import { useEffect, useState } from "react";

import api from "../api/axios";

export default function OrganizationDashboard() {
  const [organization, setOrganization] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await api.get(
        "/organizations/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrganization(
        res.data.organization
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (!organization) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        {organization.name}
      </h1>

      <p className="mt-3 text-gray-600">
        Members:{" "}
        {organization.members.length}
      </p>
    </div>
  );
}