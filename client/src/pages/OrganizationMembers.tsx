import { useEffect, useState } from "react";
import api from "../api/axios";
import { useOrganization } from "../context/OrganizationContext";

interface Member {
  _id: string;
  name: string;
  email: string;
}

export default function OrganizationMembers() {
  const { organization } = useOrganization();

  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/organizations/${organization?._id}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(res.data.members);
    } catch (error) {
      console.log(error);
    }
  };

  const inviteMember = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/organizations/invite",
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmail("");

      await fetchMembers();

      alert("Member invited successfully");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to invite member"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMembers();
    }
  }, [organization]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Organization Members
      </h1>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Members
        </h2>

        {members.length === 0 ? (
          <p>No members found</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="border rounded p-3"
              >
                <div className="font-medium">
                  {member.name}
                </div>

                <div className="text-gray-500 text-sm">
                  {member.email}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Invite Member
        </h2>

        <input
          type="email"
          placeholder="Enter member email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <button
          onClick={inviteMember}
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded mt-4"
        >
          {loading
            ? "Inviting..."
            : "Invite Member"}
        </button>
      </div>
    </div>
  );
}