import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { websiteApi } from "../services/api";
import WebsiteList from "../components/website/WebsiteList";

const Home = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await websiteApi.getUserWebsites();
      setWebsites(response.data.websites);
    } catch (error) {
      toast.error("Failed to fetch websites");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (websiteId) => {
    if (window.confirm("Are you sure you want to delete this website?")) {
      try {
        await websiteApi.deleteWebsite(websiteId);
        setWebsites(websites.filter((w) => w._id !== websiteId));
        toast.success("Website deleted successfully");
      } catch (error) {
        toast.error("Failed to delete website");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Websites</h1>
      </div>

      <WebsiteList websites={websites} onDelete={handleDelete} />
    </div>
  );
};

export default Home;
