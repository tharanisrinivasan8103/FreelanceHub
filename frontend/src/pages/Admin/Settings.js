import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: "",
    supportEmail: "",
    maintenanceMode: false,
    allowRegistrations: true,
  });

  // =============================
  // LOAD SAVED SETTINGS
  // =============================
  useEffect(() => {
    const savedSettings = localStorage.getItem("platformSettings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings({
        platformName: "FreelanceHub",
        supportEmail: "support@freelancehub.com",
        maintenanceMode: false,
        allowRegistrations: true,
      });
    }
  }, []);

  // =============================
  // HANDLE INPUT CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =============================
  // SAVE SETTINGS
  // =============================
  const handleSave = () => {
    localStorage.setItem("platformSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ===== SIDEBAR ===== */}
      <Sidebar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Platform Settings
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl">
          <h2 className="text-xl font-semibold mb-6">General</h2>

          {/* Platform Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Platform Name
            </label>
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Support Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Maintenance Mode */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-gray-500">
                Temporarily disable the platform
              </p>
            </div>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          {/* Allow Registrations */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-medium">New Registrations</p>
              <p className="text-sm text-gray-500">
                Allow new user signups
              </p>
            </div>
            <input
              type="checkbox"
              name="allowRegistrations"
              checked={settings.allowRegistrations}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>

    </div>
  );
};

export default Settings;