import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH FREELANCERS
  // =====================================
  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/users/freelancers");
      setFreelancers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  // =====================================
  // INVITE FUNCTION
  // =====================================
  const handleInvite = (freelancer) => {
    alert(`Invitation sent to ${freelancer.name}`);
    // Future: API call for invite
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">
        Browse Freelancers
      </h2>

      {/* LOADING */}
      {loading && <p>Loading freelancers...</p>}

      {/* EMPTY */}
      {!loading && freelancers.length === 0 && (
        <p>No Freelancers Found</p>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* PROFILE ICON */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {user.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {user.email}
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => handleInvite(user)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Invite Freelancer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Freelancers;