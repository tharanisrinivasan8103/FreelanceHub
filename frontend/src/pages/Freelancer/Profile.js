import React, { useState, useEffect, useRef, useCallback } from "react";
import API from "../../api/api";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", skills: "", bio: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // IMAGE CROP STATE
  const [photoURL, setPhotoURL] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, size: 200 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          skills: res.data.skills || "",
          bio: res.data.bio || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const drawCropOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || imgSize.w === 0) return;
    const ctx = canvas.getContext("2d");
    canvas.width = imgSize.w;
    canvas.height = imgSize.h;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, imgSize.w, imgSize.h);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cropBox.x + cropBox.size / 2, cropBox.y + cropBox.size / 2, cropBox.size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, 0, 0, imgSize.w, imgSize.h);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cropBox.x + cropBox.size / 2, cropBox.y + cropBox.size / 2, cropBox.size / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#14b8a6";
    ctx.beginPath();
    ctx.arc(cropBox.x + cropBox.size, cropBox.y + cropBox.size, 8, 0, Math.PI * 2);
    ctx.fill();
  }, [cropBox, imgSize]);

  useEffect(() => {
    if (showCropModal) drawCropOverlay();
  }, [cropBox, showCropModal, drawCropOverlay]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select a valid image"); return; }
    const reader = new FileReader();
    reader.onload = () => { setRawImage(reader.result); setShowCropModal(true); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const maxW = 480;
    const scale = Math.min(1, maxW / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    setImgSize({ w, h });
    const size = Math.min(200, Math.round(w * 0.65), Math.round(h * 0.65));
    setCropBox({ x: Math.round((w - size) / 2), y: Math.round((h - size) / 2), size });
  };

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    const rx = cropBox.x + cropBox.size;
    const ry = cropBox.y + cropBox.size;
    if (Math.hypot(pos.x - rx, pos.y - ry) < 14) {
      setResizing(true); setDragStart(pos); return;
    }
    const cx = cropBox.x + cropBox.size / 2;
    const cy = cropBox.y + cropBox.size / 2;
    if (Math.hypot(pos.x - cx, pos.y - cy) < cropBox.size / 2) {
      setDragging(true); setDragStart({ x: pos.x - cropBox.x, y: pos.y - cropBox.y });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    if (dragging) {
      setCropBox((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(imgSize.w - prev.size, pos.x - dragStart.x)),
        y: Math.max(0, Math.min(imgSize.h - prev.size, pos.y - dragStart.y)),
      }));
    }
    if (resizing) {
      const newSize = Math.max(60, Math.min(
        Math.min(imgSize.w - cropBox.x, imgSize.h - cropBox.y),
        Math.hypot(pos.x - cropBox.x, pos.y - cropBox.y)
      ));
      setCropBox((prev) => ({ ...prev, size: Math.round(newSize) }));
    }
  };

  const handleMouseUp = () => { setDragging(false); setResizing(false); };

  const handleCropDone = () => {
    const image = imageRef.current;
    if (!image) return;
    const scaleX = image.naturalWidth / imgSize.w;
    const scaleY = image.naturalHeight / imgSize.h;
    const outputSize = 200;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize; canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, cropBox.x * scaleX, cropBox.y * scaleY, cropBox.size * scaleX, cropBox.size * scaleY, 0, 0, outputSize, outputSize);
    setPhotoURL(canvas.toDataURL("image/jpeg", 0.92));
    setShowCropModal(false); setRawImage(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setError("Name and email are required"); return; }
    try {
      setSaving(true);
      await API.put("/users/profile", { name: form.name, email: form.email, phone: form.phone, skills: form.skills, bio: form.bio });
      setSuccess("Profile updated successfully!"); setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">My Profile</h1>
        <p className="text-gray-500 mb-8">Manage your account details, photo and security settings</p>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center w-full lg:w-72">
            <div className="relative mb-4">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-teal-500 shadow" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow border-4 border-teal-400">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{profile?.name}</h2>
            <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-2">{profile?.role}</span>
            <p className="text-gray-400 text-sm mb-1">{profile?.email}</p>
            <p className="text-gray-400 text-xs mb-6">
              Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="photo-upload" />
            <label htmlFor="photo-upload" className="w-full bg-teal-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition cursor-pointer text-center mb-2">
              🖼️ Choose Photo
            </label>
            {photoURL && (
              <button onClick={() => setPhotoURL(null)} className="w-full bg-red-50 text-red-500 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition border border-red-200">
                🗑️ Remove Photo
              </button>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex-1">
            <div className="flex gap-3 mb-6">
              <button onClick={() => setActiveTab("profile")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "profile" ? "bg-teal-600 text-white shadow" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>👤 Profile</button>
              <button onClick={() => setActiveTab("security")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "security" ? "bg-teal-600 text-white shadow" : "bg-white text-gray-600 border hover:bg-gray-50"}`}>🔒 Security</button>
            </div>

            {success && <div className="mb-4 bg-green-100 text-green-600 px-4 py-3 rounded-lg text-sm">✅ {success}</div>}
            {error && <div className="mb-4 bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">⚠️ {error}</div>}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Personal Information</h3>
                <p className="text-gray-400 text-sm mb-6">Update your name, email, bio and phone</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Role</label>
                    <input type="text" value={profile?.role || ""} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Skills</label>
                  <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python..." className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  {form.skills && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.skills.split(",").map((s, i) => s.trim() ? <span key={i} className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full">{s.trim()}</span> : null)}
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Bio</label>
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell clients about yourself..." rows="3" maxLength={300} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none" />
                  <p className="text-right text-xs text-gray-400">{form.bio.length}/300</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="bg-teal-600 text-white px-8 py-2 rounded-lg hover:bg-teal-700 transition font-semibold text-sm disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Change Password</h3>
                <p className="text-gray-400 text-sm mb-6">Update your password to keep your account secure</p>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Current Password</label>
                    <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">New Password</label>
                    <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Confirm New Password</label>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                  </div>
                  {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                    <p className="text-red-500 text-sm">Passwords do not match</p>
                  )}
                  <button disabled={!passwords.current || !passwords.newPass || passwords.newPass !== passwords.confirm} className="bg-teal-600 text-white px-8 py-2 rounded-lg hover:bg-teal-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CROP MODAL - NO LIBRARY - Pure Canvas */}
      {showCropModal && rawImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Crop Your Photo</h2>
            <p className="text-gray-400 text-sm mb-4">
              Drag the circle to move it. Drag the <span className="text-teal-600 font-semibold">teal dot</span> to resize.
            </p>

            <img ref={imageRef} src={rawImage} alt="src" onLoad={handleImageLoad} style={{ display: "none" }} />

            <div className="flex justify-center mb-6 rounded-xl overflow-hidden">
              <canvas
                ref={canvasRef}
                style={{ maxWidth: "100%", cursor: dragging ? "grabbing" : resizing ? "nwse-resize" : "default", display: "block" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowCropModal(false); setRawImage(null); }} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
                Cancel
              </button>
              <button onClick={handleCropDone} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold">
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
