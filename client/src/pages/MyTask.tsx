import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyTasks() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [issues, setIssues] = useState<any[]>([]);

  const fetchMyIssues = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/issues/my-issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIssues(res.data.issues);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyIssues();
  }, []);

  const todoIssues = issues.filter(
    (issue) => issue.status === "Todo" || issue.status === "Blocked",
  );

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress",
  );

  const testingIssues = issues.filter((issue) => issue.status === "Testing");

  const doneIssues = issues.filter((issue) => issue.status === "Done");

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-100 p-4 rounded">
          <div className="text-xl font-bold">{todoIssues.length}</div>
          <div>Open</div>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <div className="text-xl font-bold">{inProgressIssues.length}</div>
          <div>In Progress</div>
        </div>

        <div className="bg-purple-100 p-4 rounded">
          <div className="text-xl font-bold">{testingIssues.length}</div>
          <div>Testing</div>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <div className="text-xl font-bold">{doneIssues.length}</div>
          <div>Done</div>
        </div>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <Link key={issue._id} to={`/issues/${issue._id}`}>
            <div className="border rounded p-4 hover:bg-gray-50">
              <div className="font-semibold">{issue.title}</div>

              <div className="text-sm text-gray-500 mt-1">
                Project: {issue.projectId?.name}
              </div>

              <div className="text-sm mt-2">Status: {issue.status}</div>

              <div className="text-sm">Priority: {issue.priority}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
