import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectMembers() {
  const { id } = useParams();

  const [projectMembers, setProjectMembers] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any[]>([]);

  const [organizationMembers, setOrganizationMembers] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any[]>([]);

  const [selectedUser, setSelectedUser] =
    useState("");

  const token =
    localStorage.getItem("token");

  const fetchProjectMembers =
    async () => {
      try {
        const res = await api.get(
          `/projects/${id}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjectMembers(
          res.data.members
        );
      } catch (error) {
        console.log(error);
      }
    };

  const fetchOrganizationMembers =
    async () => {
      try {
        const res = await api.get(
          "/organizations/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrganizationMembers(
          res.data.organization.members
        );
      } catch (error) {
        console.log(error);
      }
    };

  const addMember = async () => {
    if (!selectedUser) return;

    try {
      await api.post(
        `/projects/${id}/members`,
        {
          userId: selectedUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedUser("");

      fetchProjectMembers();
    } catch (error) {
      console.log(error);
    }
  };

  const removeMember = async (
    userId: string
  ) => {
    try {
      await api.delete(
        `/projects/${id}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjectMembers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjectMembers();
    fetchOrganizationMembers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Project Members
      </h1>

      <div className="flex gap-3 mb-6">
        <select
          value={selectedUser}
          onChange={(e) =>
            setSelectedUser(
              e.target.value
            )
          }
          className="border p-2"
        >
          <option value="">
            Select Member
          </option>

          {organizationMembers
            .filter(
              (member) =>
                !projectMembers.some(
                  (projectMember) =>
                    projectMember._id ===
                    member._id
                )
            )
            .map((member) => (
              <option
                key={member._id}
                value={member._id}
              >
                {member.name}
              </option>
            ))}
        </select>

        <button
          onClick={addMember}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {projectMembers.map(
          (member) => (
            <div
              key={member._id}
              className="border rounded p-4 flex justify-between"
            >
              <div>
                <div className="font-semibold">
                  {member.name}
                </div>

                <div className="text-sm text-gray-500">
                  {member.email}
                </div>
              </div>

              <button
                onClick={() =>
                  removeMember(
                    member._id
                  )
                }
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}