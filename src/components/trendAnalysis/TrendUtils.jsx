export const calculateStatistics = (data, categories) => {
    const stats = {};
    categories.forEach(category => {
      const values = data.map(item => item[category]);
      stats[category] = {
        highest: Math.max(...values),
        lowest: Math.min(...values),
        average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
        current: values[values.length - 1],
        trend: values[values.length - 1] > values[0] ? 'Increasing' : 'Decreasing'
      };
    });
    return stats;
  };