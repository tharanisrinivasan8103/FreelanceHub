import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

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

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
console.log("API initialized with base URL:", BASE_URL);
// USERS
export const getAllUsers = () => API.get("/users");
export const getFreelancers = () => API.get("/users/freelancers");
export const getClients = () => API.get("/users/clients");

// PROJECTS
export const createProject = (data) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return API.post("/projects", { ...data, client_id: data.client_id || user.id });
};
export const getAllProjects = () => API.get("/projects");
export const getClientProjects = (clientId) => API.get(`/projects/client/${clientId}`);
export const getFreelancerDashboard = () => API.get("/projects/freelancer/dashboard");

// PROPOSALS
export const sendProposal = (data) => API.post("/proposals", data);
export const getProjectProposals = (projectId) => API.get(`/proposals/project/${projectId}`);
export const getMyProposals = () => API.get("/proposals/my");

// SUBMISSIONS
export const submitProject = (data) => API.post("/submissions", data);
export const getMySubmissions = () => API.get("/submissions/my");
export const getProjectSubmissions = (projectId) => API.get(`/submissions/project/${projectId}`);
export const approveSubmission = (id) => API.put(`/submissions/${id}/approve`);
export const requestRevision = (id, feedback) => API.put(`/submissions/${id}/revision`, { feedback });

// ADMIN
export const getAdminDashboard = () => API.get("/admin/dashboard");

export default API;