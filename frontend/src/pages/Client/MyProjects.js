import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/projects/client");
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <button
            onClick={() => navigate("/client/post-project")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Post New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow">
            No projects posted yet.{" "}
            <span
              className="text-teal-600 cursor-pointer font-semibold"
              onClick={() => navigate("/client/post-project")}
            >
              Post one now!
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{p.description?.slice(0, 100)}...</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">₹{p.budget}</span>
                      {p.deadline && <span>📅 {formatDate(p.deadline)}</span>}
                      {p.category && (
                        <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-xs capitalize">
                          {p.category}
                        </span>
                      )}
                    </div>
                    {p.skills && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {p.skills.split(",").map((s, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    p.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {p.status || "open"}
                  </span>
                </div>

                {/* View Proposals Button */}
                <div className="mt-4 border-t pt-4">
                  <button
                    onClick={() => navigate(`/client/projects/${p.id}/proposals`)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    View Proposals →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
