import React from 'react';
import CategoryComparison from './CategoryComparison';

const StatisticsDashboard = ({ statistics }) => {
  return (
    <div>
      <CategoryComparison statistics={statistics} />
    </div>
  );
};

export default StatisticsDashboard;