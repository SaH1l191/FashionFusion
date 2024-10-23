import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';
import { Tabs, TabsList, TabsTrigger } from './Tabs';
import TrendChart from './TrendChart';
import StatisticsDashboard from './StatisticsDashboard';
import CategoryManager from './CategoryManager';
import useTrendData from './useTrendData';
import { calculateStatistics } from './trendUtils';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrendAnalytics = () => {
  const [categories, setCategories] = useState([]);
  const [timespan, setTimespan] = useState('last_month');
  const [activeTab, setActiveTab] = useState('chart');
  const [showAnnotations, setShowAnnotations] = useState(false);
  
  const { chartData, loading, error } = useTrendData(categories, timespan);
  const statistics = calculateStatistics(chartData, categories);

  const statisticsDashboardRef = useRef(null);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === 'dashboard' && statisticsDashboardRef.current) {
      statisticsDashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleAnnotations = () => {
    setShowAnnotations((prevState) => !prevState);
  };

  const { data: user } = useQuery({ queryKey: ["authUser"] });
  const navigate = useNavigate();
  
  if (user?.subscription !== 'Pro') {
    return (
      <div className="relative h-screen">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-75 backdrop-blur-2xl">
          <Lock className="w-16 h-16 mb-4 text-gray-500" />
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Premium Content</h2>
          <p className="mb-6 text-gray-600">Subscribe to access trend analytics</p>
          <Button onClick={() => navigate('/pricing')} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Upgrade to Pro
          </Button>
        </div>
        <div className="filter blur-sm">
          {/* Render the original content here */}
          <div className="container px-4 mx-auto mt-8">
            <h1 className="mb-8 text-3xl font-bold text-center">Fashion Trend Analysis</h1>
            {/* ... rest of the component ... */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Fashion Trend Analysis</h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Trend Chart</TabsTrigger>
          <TabsTrigger value="dashboard">Statistics Dashboard</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Trend Analysis Results</h2>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-red-500">{error}</p>
                </div>
              ) : categories.length > 0 ? (
                <TrendChart chartData={chartData} categories={categories} showAnnotations={showAnnotations} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500">Add categories to see trend analysis</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Fashion Analysis Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Timespan</label>
                <Select value={timespan} onValueChange={setTimespan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timespan for fashion trends" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_day">Last day</SelectItem>
                    <SelectItem value="last_week">Last week</SelectItem>
                    <SelectItem value="last_month">Last month</SelectItem>
                    <SelectItem value="last_3_months">Last 3 months</SelectItem>
                    <SelectItem value="last_year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Search Fashion Trends</label>
                <input
                  type="text"
                  placeholder="Search for clothing styles, brands, trends..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Fashion Categories</label>
                <CategoryManager
                  categories={categories}
                  setCategories={setCategories}
                  presetCategories={["Streetwear", "Luxury Brands", "Sustainable Fashion", "Vintage", "Athleisure"]}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {categories.length > 0 && (
        <div ref={statisticsDashboardRef}>
          <h2 className="mb-4 text-2xl font-semibold">Statistics Dashboard</h2>
          <StatisticsDashboard statistics={statistics} />
        </div>
      )}
    </div>
  );
};

export default TrendAnalytics;