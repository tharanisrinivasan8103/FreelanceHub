import React, { useEffect, useState } from "react";
import API from "../../api/api";

const categories = [
  "All",
  "Web Development",
  "Mobile Development",
  "Design",
  "Marketing",
  "Backend Development",
];

const FindProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // ================= FETCH PROJECTS =================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ================= FILTER =================
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ================= SEND PROPOSAL =================
  const sendProposal = async (projectId) => {
    const bid = prompt("Enter Your Bid Amount");
    const message = prompt("Enter Proposal Message");

    if (!bid || !message) return;

    try {
      await API.post("/proposals", {
        project_id: projectId,
        bid,
        message,
      });

      alert("Proposal Sent Successfully");
    } catch (error) {
      alert("Error sending proposal");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Find Projects
        </h1>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center mb-8">

          {/* Search */}
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading projects...</p>
        )}

        {/* PROJECT CARDS */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* TOP SECTION */}
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {project.description}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                  Open
                </span>
              </div>

              {/* SKILLS */}
              {project.skills && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* DIVIDER */}
              <div className="border-t mt-6 pt-4 flex justify-between items-center">

                <div className="flex gap-6 text-gray-600 text-sm">
                  <span>₹ {project.budget}</span>

                  {project.deadline && (
                    <span>{project.deadline}</span>
                  )}

                  {project.company && (
                    <span>{project.company}</span>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-teal-600 font-medium text-sm">
                    {project.proposalsCount || 0} proposals
                  </span>

                  <button
                    onClick={() => sendProposal(project.id)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                  >
                    Apply
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FindProjects;