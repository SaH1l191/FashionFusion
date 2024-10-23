import React from 'react';
import { Card, CardHeader, CardContent } from './Card';

const TrendingTopics = ({ trendingTopics, loading, error }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Trending Topics</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : trendingTopics.length > 0 ? (
          <ul className="space-y-4">
            {trendingTopics.map((topic, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-4 font-semibold">{index + 1}.</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-lg text-gray-500">No trending topics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;