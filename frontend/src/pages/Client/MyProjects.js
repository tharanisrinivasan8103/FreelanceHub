import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const MyProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH PROJECTS
  // =====================================
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects/client/my-projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-8">
      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-6">
        My Projects
      </h2>

      {/* LOADING */}
      {loading && <p>Loading Projects...</p>}

      {/* EMPTY */}
      {!loading && projects.length === 0 && (
        <p>No Projects Found</p>
      )}

      {/* PROJECT GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* TITLE */}
            <h3 className="text-lg font-semibold mb-2">
              {project.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-600 mb-3">
              {project.description}
            </p>

            {/* BUDGET */}
            <p className="text-blue-600 font-bold mb-4">
              Budget : ₹{project.budget}
            </p>

            {/* BUTTON */}
            <button
              onClick={() =>
                navigate(`/client/projects/${project.id}/proposals`)
              }
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              View Proposals
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;