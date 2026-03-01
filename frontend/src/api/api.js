import axios from "axios";

// ======================================================
// BASE URL
// ======================================================
const BASE_URL = "http://localhost:5000/api";

// ======================================================
// CREATE AXIOS INSTANCE
// ======================================================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // prevent CORS cookie issues
});

// ======================================================
// REQUEST INTERCEPTOR
// Attach JWT Token Automatically
// ======================================================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// Handle Token Expire / Unauthorized
// ======================================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// ======================================================
// AUTH API
// ======================================================
export const registerUser = (data) => API.post("/auth/register", data);

export const loginUser = (data) => API.post("/auth/login", data);

// ======================================================
// USER API
// ======================================================
export const getAllUsers = () => API.get("/users");

export const getFreelancers = () => API.get("/users/freelancers");

export const getClients = () => API.get("/users/clients");

// ======================================================
// PROJECT API
// =====================================================
// when posting a project we need to include the authenticated
// client's id. instead of relying on every caller to remember to
// send it we automatically read the current user from
// localStorage and merge the value in here. callers can still pass
// a `client_id` explicitly if they prefer (useful for tests).
export const createProject = (data) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const payload = {
    ...data,
    client_id: data.client_id || user.id, // prefer passed value
  };
  return API.post("/projects", payload);
};

export const getAllProjects = () => API.get("/projects");

export const getClientProjects = (clientId) =>
  API.get(`/projects/client/${clientId}`);

// ======================================================
// PROPOSAL API
// ======================================================
export const sendProposal = (data) => API.post("/proposals", data);

export const getProjectProposals = (projectId) =>
  API.get(`/proposals/project/${projectId}`);

export const getFreelancerProposals = (freelancerId) =>
  API.get(`/proposals/freelancer/${freelancerId}`);

// ======================================================
// ADMIN API
// ======================================================
export const getAdminDashboard = () =>
  API.get("/admin/dashboard");

// ======================================================
// EXPORT DEFAULT
// ======================================================
export default API;