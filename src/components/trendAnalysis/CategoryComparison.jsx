import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const CategoryComparison = ({ statistics }) => {
  const categories = Object.keys(statistics);

  if (categories.length === 0) {
    return null;
  }

  const prepareBarChartData = () => {
    return categories.map(category => ({
      name: category,
      current: statistics[category].current,
      average: statistics[category].average
    }));
  };

  const prepareRadarChartData = () => {
    return categories.map(category => ({
      category: category,
      current: statistics[category].current,
      highest: statistics[category].highest,
      lowest: statistics[category].lowest,
    }));
  };

  const preparePieChartData = () => {
    return categories.map(category => ({
      name: category,
      value: statistics[category].current,
      percentage: (statistics[category].current / Object.values(statistics).reduce((sum, stat) => sum + stat.current, 0)) * 100
    }));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <h3 className="text-xl font-semibold">Category Comparison</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h4 className="text-sm font-medium mb-4 text-center">Current vs Average Interest</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={prepareBarChartData()}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="current" fill="#8884d8" name="Current" />
                <Bar dataKey="average" fill="#82ca9d" name="Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h4 className="text-sm font-medium mb-4 text-center">Current Interest vs Highs and Lows</h4>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={prepareRadarChartData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fontSize: 12 }} />
                <Radar name="Highest" dataKey="highest" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                <Radar name="Current" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Lowest" dataKey="lowest" stroke="#ffc658" fill="#ffc658" fillOpacity={0.1} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="p-4 border rounded-lg shadow-sm">
            <h4 className="text-sm font-medium mb-4 text-center">Current Interest Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={preparePieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${percent.toFixed(2)}%)`}
                >
                  {preparePieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    value,
                    `${name} (${props.payload.percentage.toFixed(2)}%)`
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {categories.map(category => (
            <Card key={category} className="bg-gray-100">
              <CardHeader>
                <h4 className="text-lg font-semibold">{category}</h4>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current:</span>
                  <span className="text-lg font-semibold">{(statistics[category].current / Object.values(statistics).reduce((sum, stat) => sum + stat.current, 0) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Trend:</span>
                  <span className={`text-lg font-semibold flex items-center ${statistics[category].trend === 'Increasing' ? 'text-green-500' : 'text-red-500'}`}>
                    {statistics[category].trend}
                    {statistics[category].trend === 'Increasing' ? (
                      <ArrowUpIcon className="ml-1 w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="ml-1 w-4 h-4" />
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryComparison;