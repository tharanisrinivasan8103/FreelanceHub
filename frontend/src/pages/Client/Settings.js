import React, { useState } from "react";

const Settings = () => {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    about: "",
    website: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings Saved Successfully");
    // Later: connect API here
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">
        Account Settings
      </h2>

      <div className="max-w-2xl bg-white p-8 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-6">
          Company Info
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            name="email"
            placeholder="Contact Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <textarea
            name="about"
            placeholder="About Company"
            rows="4"
            value={form.about}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            name="website"
            placeholder="Website URL"
            value={form.website}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
};

export default Settings;