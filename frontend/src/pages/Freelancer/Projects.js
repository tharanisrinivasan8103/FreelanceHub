import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data || []);
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
    <div className="bg-gray-50 min-h-screen p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Projects
        </h1>

        {loading && <p>Loading Projects...</p>}

        {!loading && projects.length === 0 && (
          <p>No Projects Found</p>
        )}

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {project.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {project.description}
              </p>

              <p className="text-green-600 font-bold mt-3">
                ₹ {project.budget}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Projects;