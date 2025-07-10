import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function useFetchData(apiEndpoint) {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiEndpoint) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(apiEndpoint);
        // Accept both array and object format
        setAllData(Array.isArray(res.data) ? res.data : res.data.blogs || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) {
          toast.error("API endpoint not found");
        } else {
          toast.error("Failed to fetch data");
        }
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [apiEndpoint]);

  return { allData, loading };
}

export default useFetchData;