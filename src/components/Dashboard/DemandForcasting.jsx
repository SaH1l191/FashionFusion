import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

const DemandForecasting = () => {
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState(null);

    const { data: user } = useQuery({ queryKey: ["authUser"] });
    const navigate = useNavigate();



    const fetchDataAndForecast = async () => {
        setLoading(true);

        try {
            const fetchResponse = await axios.get('http://localhost:8000/api/fetch_summary/', {
                params: {
                    username: 'johndoe',
                    password: 'password123'
                }
            });

            const forecastResponse = await axios.get('http://localhost:8000/api/forecast/');
            setForecastData(forecastResponse.data.forecasts);

            toast.success("Forecast data updated successfully!")
        } catch (error) {
            toast.error("Failed to fetch forecast data. Please try again.")
        } finally {
            setLoading(false);
        }
    };

    const analyzeForecastData = (product) => {
        if (!forecastData || !forecastData[product]) return null;
        
        const { dates, forecast } = forecastData[product];
        const data = dates.map((date, index) => ({
            date: formatDate(date),
            forecast: Math.round(forecast[index])
        }));

        const lastValue = forecast[forecast.length - 1];
        const firstValue = forecast[0];
        const trend = ((lastValue - firstValue) / firstValue) * 100;
        const average = Math.round(forecast.reduce((a, b) => a + b, 0) / forecast.length);
        const max = Math.round(Math.max(...forecast));
        const min = Math.round(Math.min(...forecast));

        return {
            data,
            stats: {
                trend,
                average,
                max,
                min
            }
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

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
        <div className="p-6 mx-auto max-w-7xl">
            <Card className="bg-white shadow-lg">
                <CardHeader className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Activity className="w-6 h-6 text-blue-600" />
                        <CardTitle className="text-2xl font-bold">Demand Forecasting Dashboard</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500">
                        Weekly demand predictions for the next 4 weeks based on historical sales data.
                        The forecast uses ARIMA (Autoregressive Integrated Moving Average) modeling for accurate predictions.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Button
                            onClick={fetchDataAndForecast}
                            disabled={loading}
                            className="px-6 text-white bg-black hover:bg-gray-800"
                            variant="secondary"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing Data...
                                </>
                            ) : (
                                <>
                                    <Activity className="w-4 h-4 mr-2" />
                                    Generate New Forecast
                                </>
                            )}
                        </Button>
                        
                        {status && (
                            <Alert
                                variant={status.success ? "default" : "destructive"}
                                className="flex-1"
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <AlertDescription>
                                    {status.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                        {forecastData && Object.keys(forecastData).map(product => {
                            const analysis = analyzeForecastData(product);
                            if (!analysis) return null;

                            return (
                                <Card key={product} className="p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{product}</h3>
                                            <div className="flex items-center space-x-2">
                                                {analysis.stats.trend > 0 ? (
                                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-5 h-5 text-red-500" />
                                                )}
                                                <span className={`font-medium ${analysis.stats.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {Math.abs(analysis.stats.trend).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pb-4">
                                            <div className="p-2 text-center rounded-lg bg-blue-50">
                                                <div className="text-sm text-gray-600">Average Weekly Demand</div>
                                                <div className="text-lg font-bold text-blue-700">{analysis.stats.average} units</div>
                                            </div>
                                            <div className="p-2 text-center rounded-lg bg-green-50">
                                                <div className="text-sm text-gray-600">Peak Weekly Demand</div>
                                                <div className="text-lg font-bold text-green-700">{analysis.stats.max} units</div>
                                            </div>
                                            <div className="p-2 text-center rounded-lg bg-red-50">
                                                <div className="text-sm text-gray-600">Lowest Weekly Demand</div>
                                                <div className="text-lg font-bold text-red-700">{analysis.stats.min} units</div>
                                            </div>
                                        </div>

                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={analysis.data}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 25
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                    <XAxis
                                                        dataKey="date"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={50}
                                                        tick={{ fill: '#666', fontSize: 12 }}
                                                    />
                                                    <YAxis 
                                                        tick={{ fill: '#666' }}
                                                        label={{ 
                                                            value: 'Predicted Weekly Demand', 
                                                            angle: -90, 
                                                            position: 'insideLeft',
                                                            style: { fill: '#666' }
                                                        }}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                                        }}
                                                        formatter={(value) => [`${value} units`, 'Predicted Weekly Demand']}
                                                        labelFormatter={(label) => `Week of ${label}`}
                                                    />
                                                    <Legend />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="forecast"
                                                        stroke="#2563eb"
                                                        fill="rgba(37, 99, 235, 0.1)"
                                                        strokeWidth={2}
                                                        name="Predicted Weekly Demand"
                                                        dot={{ r: 4, fill: '#2563eb' }}
                                                        activeDot={{ r: 6, fill: '#2563eb' }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {!forecastData && !loading && (
                        <div className="py-12 text-center">
                            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">
                                Generate a new forecast to view demand predictions for your products
                            </p>
                            <p className="mt-2 text-sm text-gray-400">
                                The forecast will show predicted weekly demand for the next 4 weeks
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DemandForecasting;