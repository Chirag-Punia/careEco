import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export async function generateWebsite(websiteData) {
  try {
    const response = await axios.post(`${API_URL}/generate-website`, websiteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate website');
  }
}