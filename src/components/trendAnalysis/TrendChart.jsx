import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ReferenceDot } from 'recharts';
import { format } from 'date-fns';
import CustomTooltip from './CustomTooltip';

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28'];

const calculatePercentageChange = (previous, current) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const TrendChart = ({ chartData, categories, showAnnotations }) => {
  const [loading, setLoading] = useState(true);
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      // Calculate annotations (significant drops/spikes)
      const newAnnotations = [];
      chartData.forEach((data, idx) => {
        if (idx > 0) {
          categories.forEach((category) => {
            const previousValue = chartData[idx - 1][category];
            const currentValue = data[category];
            const percentageChange = calculatePercentageChange(previousValue, currentValue);

            // Only consider large changes (threshold at 15% for large changes)
            if (Math.abs(percentageChange) >= 15) {
              newAnnotations.push({
                x: data.date,
                y: currentValue,
                value: percentageChange.toFixed(2),
                category,
                color: percentageChange > 0 ? 'green' : 'red',  // Green for increase, Red for decrease
              });
            }
          });
        }
      });
      setAnnotations(newAnnotations);
    }, 1000);

    return () => clearTimeout(timer);
  }, [chartData, categories]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Interest', angle: -90, position: 'insideLeft', offset: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />

          {/* Render lines and areas for each category */}
          {categories.map((category, index) => (
            <React.Fragment key={category}>
              <Line
                type="monotone"
                dataKey={category}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey={category}
                fill={colors[index % colors.length]}
                fillOpacity={0.1}
                stroke="none"
              />
            </React.Fragment>
          ))}

          {/* Render annotation points for significant changes */}
          {showAnnotations && annotations.map((annotation, index) => (
            <ReferenceDot
              key={index}
              x={annotation.x}
              y={annotation.y}
              r={4}  // Reduced dot size for more subtle visuals
              fill={annotation.color}  // Green for positive, red for negative
              stroke="none"
              label={{ position: 'top', value: `${annotation.value}%`, fill: annotation.color, fontSize: 12 }}
            />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default TrendChart;