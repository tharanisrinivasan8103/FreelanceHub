import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      // Get only proposals where this freelancer was ACCEPTED
      const res = await API.get("/proposals/my");
      
      // Filter only accepted proposals
      const acceptedProposals = (res.data || []).filter(
        (p) => p.status === "accepted"
      );
      
      setProjects(acceptedProposals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Projects</h1>

        {loading && <p className="text-gray-500">Loading Projects...</p>}

        {!loading && projects.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg mb-4">
              No active projects yet. Apply to projects and get hired!
            </p>
            <button
              onClick={() => navigate("/freelancer/find-projects")}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Find Projects
            </button>
          </div>
        )}

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {project.project_title}
                  </h3>

                  {/* Message */}
                  <p className="text-gray-500 text-sm mb-4">
                    Your proposal: {project.message}
                  </p>

                  {/* Details */}
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-600">
                      Project Budget: <strong>₹{project.project_budget}</strong>
                    </span>
                    <span className="text-teal-600 font-semibold">
                      Your Bid: ₹{project.bid}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="ml-4 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                  Accepted ✓
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Projects;