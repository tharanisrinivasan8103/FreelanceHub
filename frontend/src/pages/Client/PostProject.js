import React, { useState } from "react";
import { createProject } from "../../api/api";
import { useNavigate } from "react-router-dom";

const PostProject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  // ================================
  // HANDLE CHANGE
  // ================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // HANDLE SUBMIT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProject({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        skills: form.skills,
        deadline: form.deadline,
      });

      alert("Project Posted Successfully");
      navigate("/client/my-projects");
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.message || "Error posting project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          Post New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={form.budget}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            name="skills"
            placeholder="Required Skills (eg: React, Node)"
            value={form.skills}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Posting..." : "Post Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProject;