import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/projects/client",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || [];
      setProjects(data);

      // Calculate stats
      const active = data.filter((p) => p.status === "open");
      const pending = data.filter((p) => p.status === "pending");
      const completed = data.filter((p) => p.status === "completed");

      setActiveCount(active.length);
      setPendingCount(pending.length);
      setCompletedCount(completed.length);

      const total = completed.reduce(
        (sum, p) => sum + Number(p.budget || 0),
        0
      );

      setTotalSpent(total);

      setLoading(false);

    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Client Dashboard
          </h1>
          <p className="text-gray-500">
            Manage your projects and freelancers
          </p>
        </div>

        <button
          onClick={() => navigate("/client/post-project")}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          + Post New Project
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Active Projects</p>
          <h2 className="text-2xl font-bold mt-2">{activeCount}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold mt-2">₹{totalSpent}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Pending Reviews</p>
          <h2 className="text-2xl font-bold mt-2">{pendingCount}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-bold mt-2">{completedCount}</h2>
        </div>

      </div>

      {/* RECENT PROJECTS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Recent Projects
        </h2>

        {projects.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {project.description}
                    </p>
                    <p className="text-sm text-gray-400 mt-3">
                      ₹ {project.budget}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${
                      project.status === "open"
                        ? "bg-green-100 text-green-600"
                        : project.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ClientDashboard;