import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useOrganization } from "../context/OrganizationContext";
import { useAuth } from "../context/AuthContext";

interface Member {
  _id: string;
  name: string;
  email: string;
}

export default function CreateProject() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { organization } = useOrganization();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
console.log(user);
  useEffect(() => {
    if (organization) {
      // eslint-disable-next-line react-hooks/immutability
      fetchMembers();
    }
  }, [organization]);

  useEffect(() => {
    if (user?._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedMembers([user._id]);
    }
  }, [user]);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/organizations/${organization?._id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(res.data.members);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberChange = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/projects",
        {
          name,
          description,
          members: selectedMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Project created successfully");

      navigate("/projects");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Project Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="E-Commerce Website"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded"
            rows={4}
            placeholder="Project description..."
          />
        </div>

        <div>
          <label className="block mb-3 font-medium">Project Members</label>

          {members.map((member) => {
            const isOwner = member._id === user?._id;

            return (
              <label key={member._id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member._id)}
                  disabled={isOwner}
                  onChange={(e) =>
                    handleMemberChange(member._id, e.target.checked)
                  }
                />
                <span>
                  {member.name}
                  {isOwner && " (Owner)"}
                </span>
              </label>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
