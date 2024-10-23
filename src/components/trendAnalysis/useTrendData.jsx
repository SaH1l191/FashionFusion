import { useState, useEffect } from 'react';
import axios from 'axios';

const useTrendData = (categories, timespan, country) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (categories.length === 0) {
        setChartData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('http://localhost:8000/api/trends/', {
          categories,
          timespan,
          country,
        });
        setChartData(response.data.chartData);
      } catch (error) {
        console.error('Error fetching trend data:', error);
        setError('Failed to fetch trend data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categories, timespan, country]);

  return { chartData, loading, error };
};

export default useTrendData;