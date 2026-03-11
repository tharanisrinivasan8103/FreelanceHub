import React, { useEffect, useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: "",
    supportEmail: "",
    maintenanceMode: false,
    allowRegistrations: true,
  });
  const [saved, setSaved] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("platformSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">

      {/* Top Header */}
      <div className="bg-white border-b px-8 py-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700">Settings</h2>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Platform Settings
          </h1>

          {saved && (
            <div className="mb-6 bg-green-100 text-green-600 px-4 py-3 rounded-lg">
              ✅ Settings saved successfully!
            </div>
          )}

          {/* General Settings Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              General
            </h2>

            {/* Platform Name */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>

            {/* Support Email */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Toggle Settings Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Platform Controls
            </h2>

            {/* Maintenance Mode */}
            <div className="flex justify-between items-center py-4 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-800">Maintenance Mode</p>
                <p className="text-sm text-gray-500">
                  Temporarily disable the platform for all users
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            {/* Allow Registrations */}
            <div className="flex justify-between items-center py-4">
              <div>
                <p className="font-semibold text-gray-800">New Registrations</p>
                <p className="text-sm text-gray-500">
                  Allow new users to sign up on the platform
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="allowRegistrations"
                  checked={settings.allowRegistrations}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition font-semibold text-sm"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
};

export default Settings;
