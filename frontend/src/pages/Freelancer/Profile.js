import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/users/profile");
      setProfile(res.data || {});
    } catch (err) {
      console.error("Profile fetch error:", err.response || err.message);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = async () => {
    try {
      setSaving(true);
      setError("");

      await API.put("/users/profile", profile);

      alert("Profile Updated Successfully ✅");
    } catch (err) {
      console.error("Profile update error:", err.response || err.message);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-10">
      <div className="max-w-3xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Profile
        </h1>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-600">Loading Profile...</p>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* FORM */}
        {!loading && (
          <div className="bg-white p-8 rounded-xl shadow-md">

            {/* NAME */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* BIO */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* SKILLS */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={profile.skills || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={updateProfile}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;