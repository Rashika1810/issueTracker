import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProject();
    // eslint-disable-next-line react-hooks/immutability
    fetchIssues();
  }, []);

  const fetchProject = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProject(res.data.project);
  };
  const deleteProject = async () => {
    const confirmed = window.confirm("Delete this project and all issues?");

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Project deleted");

      navigate("/projects");
    } catch (error) {
      console.log(error);
    }
  };
  const fetchIssues = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/issues/project/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIssues(res.data.issues);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">{project.name}</h1>

      <p className="mt-2">{project.description}</p>
      <button
        onClick={deleteProject}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete Project
      </button>

      <Link
        to={`/projects/${id}/issues/create`}
        className="inline-block mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Create Issue
      </Link>
      <Link
        to={`/projects/${id}/board`}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Open Board
      </Link>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Issues</h2>

        {issues.length === 0 ? (
          <p>No issues yet</p>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="block border rounded p-4"
              >
                <h3 className="font-semibold">{issue.title}</h3>

                <div className="flex gap-3 mt-2 text-sm">
                  <span>Status: {issue.status}</span>

                  <span>
                    Priority:
                    {issue.priority}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
