import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProjects(res.data.projects);
  };

  return (
    <div className="p-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>

        <Link to="/projects/create" className="bg-black text-white px-4 py-2">
          New Project
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {projects.map((project: any) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="block border p-4 rounded"
          >
            <h2 className="font-semibold">{project.name}</h2>

            <p>{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
