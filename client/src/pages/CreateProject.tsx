import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateProject() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await api.post(
      "/projects",
      {
        name,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    navigate("/projects");
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="max-w-lg">
        <h1 className="text-3xl font-bold mb-5">Create Project</h1>

        <input
          className="border p-2 w-full mb-4"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-black text-white px-4 py-2">
          Create Project
        </button>
      </form>
    </div>
  );
}
