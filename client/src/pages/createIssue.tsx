import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function CreateIssue() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("Medium");

  const [type, setType] = useState("Task");

  const [component, setComponent] = useState("Other");

  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await api.post(
      "/issues",
      {
        projectId: id,
        title,
        description,
        priority,
        type,
        component,

        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    navigate(`/projects/${id}`);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">Create Issue</h1>

      <form onSubmit={handleSubmit} className="max-w-lg">
        <input
          className="border p-2 w-full mb-4"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-4"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <div>
          <label>Issue Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 w-full"
          >
            <option>Bug</option>
            <option>Feature</option>
            <option>Task</option>
            <option>Improvement</option>
            <option>Hotfix</option>
          </select>
        </div>
        <div>
          <label>Component</label>

          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className="border p-2 w-full"
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>API</option>
            <option>Database</option>
            <option>DevOps</option>
            <option>Mobile</option>
            <option>UI/UX</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label>Tags (optional)</label>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="login,payment,oauth"
            className="border p-2 w-full"
          />
        </div>

        <button className="bg-black text-white px-4 py-2">Create Issue</button>
      </form>
    </div>
  );
}
