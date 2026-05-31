import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "../context/OrganizationContext";
import api from "../api/axios";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const { fetchOrganization } = useOrganization();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/organizations",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchOrganization();

      navigate("/organization");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="border p-8 rounded-lg w-112.5">
        <h1 className="text-3xl font-bold mb-5">Create Organization</h1>

        <input
          type="text"
          placeholder="Organization Name"
          className="border p-2 w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="bg-black text-white w-full p-2">Create</button>
      </form>
    </div>
  );
}
