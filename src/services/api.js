import axios from "axios";

const API_URL = "http://localhost:3000/api";

const token = localStorage.getItem("token");

export async function generateWebsite(websiteData) {
  try {
    const response = await axios.post(
      `${API_URL}/websites/generate-website`,
      websiteData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to generate website"
    );
  }
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const websiteApi = {
  getUserWebsites: () => api.get("/websites"),
  deleteWebsite: (id) => api.delete(`/websites/${id}`),
};

export default api;
