import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getAllProjects } from "../../api/api";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col">

        {/* Top Header Bar */}
        <div className="bg-white border-b px-8 py-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            Projects
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">

            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              All Projects
            </h1>

            {/* Projects List */}
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="text-center text-gray-500">
                No projects available
              </p>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {project.title}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          project.status === "closed"
                            ? "bg-red-100 text-red-600"
                            : project.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {project.status || "open"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                      {project.description}
                    </p>

                    <hr className="mb-4" />

                    {/* Footer Info */}
                    <div className="flex flex-wrap justify-between text-sm text-gray-500 gap-4">
                      <span>
                        💰 ₹{project.budget?.toLocaleString("en-IN")}
                      </span>

                      <span>
                        📅 {project.created_at?.slice(0, 10)}
                      </span>

                      <span>
                        🏢 {project.company_name || "Company Name"}
                      </span>

                      <span className="text-green-600 font-medium">
                        {project.proposals || 0} proposals
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjects;