import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../api/axios";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProject();
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

  if (!project) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">{project.name}</h1>

      <p className="mt-3">{project.description}</p>
    </div>
  );
}
