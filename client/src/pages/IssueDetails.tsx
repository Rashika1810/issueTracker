import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function IssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIssue = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/issues/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIssue(res.data.issue);
    setStatus(res.data.issue.status);

    setPriority(res.data.issue.priority);
  };

  if (!issue) {
    return <div>Loading...</div>;
  }
  const updateIssue = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/issues/${id}`,
        {
          status,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Issue updated");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-10 max-w-4xl">
      <h1 className="text-3xl font-bold">{issue.title}</h1>

      <p className="mt-4">{issue.description}</p>

      <div className="mt-6 flex gap-4">
        <span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Testing</option>
            <option>Done</option>
            <option>Blocked</option>
          </select>
        </span>

        <span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </span>
      </div>
      <button
        onClick={updateIssue}
        className="bg-black text-white px-4 py-2 rounded mt-5"
      >
        Save Changes
      </button>
      <div className="mt-4">
        Reporter:
        {issue.reporter?.name}
      </div>

      <div className="mt-2">
        Assignee:
        {issue.assignee?.name || "Unassigned"}
      </div>
    </div>
  );
}
