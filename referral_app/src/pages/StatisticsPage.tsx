import React, { useState, useEffect, useMemo } from 'react'; // Remove memo import
import { getStatistics } from '../services/api'; // Import getStatistics
import type { StatisticsResponse, TimeSeriesData } from '../types'; // Import StatisticsResponse and TimeSeriesData
// Import Recharts components (assuming library will be installed)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'; // Added BarChart components

// Removed StringCountMap type as processing is moved to backend simulation

const StatisticsPage: React.FC = () => {
  console.log(">>> StatisticsPage COMPONENT BODY EXECUTING"); // Log component execution
  const [statsData, setStatsData] = useState<StatisticsResponse | null>(null); // State to hold fetched statistics
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch statistics data on mount
  useEffect(() => {
    // console.log(">>> StatisticsPage: Fetch useEffect RUNNING"); // Log when effect runs (optional)
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStatistics(); // Call the new API function
        console.log("--- StatisticsPage: Raw API Data ---", data); // Log raw data
        setStatsData(data);
      } catch (err: any) {
        setError(err?.error || 'Failed to load statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []); // Keep empty dependency array

  // Format data for Recharts Time Series chart
  const formattedTimeSeriesData = useMemo(() => {
    if (!statsData?.timeSeries?.daily) return [];

    // Convert daily data object to sorted array for chart
    return Object.entries(statsData.timeSeries.daily)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

    // TODO: Add logic to switch between daily/weekly/monthly if needed
  }, [statsData]);

  // Log formatted data whenever it changes
  useEffect(() => {
    console.log("--- StatisticsPage: Formatted Chart Data ---", formattedTimeSeriesData);
  }, [formattedTimeSeriesData]);

  // Chart data processing logic removed - now handled by backend simulation


  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Usage Statistics</h2>

      {loading && <p className="text-center text-gray-600">Loading statistics...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {/* Update condition to check statsData */}
      {!loading && !error && (!statsData || statsData.totalRecords === 0) && (
        <p className="text-center text-gray-500">No data available to generate statistics.</p>
      )}

      {/* --- Charts Section (Moved from RecordsView) --- */}
      {/* Update condition and use statsData */}
      {!loading && !error && statsData && statsData.totalRecords > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Time Series Bar Chart */}
          <div className="p-4 border rounded shadow-sm bg-gray-50">
            <h4 className="text-lg font-semibold mb-2 text-center text-gray-700">Codes Generated (Daily)</h4>
            {/* Recharts Container */}
            <div className="h-64 w-full">
              {/* Ensure only BarChart is direct child */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedTimeSeriesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="date" fontSize={10} scale="band" /> {/* Restored scale */}
                  <YAxis allowDecimals={false} fontSize={10} type="number" /> {/* Restored type */}
                  <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#8884d8" name="Codes Generated" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Chart 2 removed */}
          {/* Chart 3 Placeholder */}
          <div className="p-4 border rounded shadow-sm bg-gray-50">
            <h4 className="text-lg font-semibold mb-2 text-center text-gray-700">Popular Attributes (Top 10)</h4>
            {/* Recharts Container for Popular Attributes - Split into sub-charts */}
            <div className="h-64 w-full space-y-2 overflow-y-auto">
              {/* Industries */}
              <div>
                <h5 className="text-sm font-medium text-center text-gray-600 mb-1">Industries</h5>
                {/* Add null check for statsData.popularity.industries */}
                <ResponsiveContainer width="100%" height={Math.max(60, (statsData?.popularity?.industries?.length ?? 0) * 20)}>
                  <BarChart data={statsData?.popularity?.industries ?? []} layout="vertical" margin={{ top: 0, right: 25, left: 50, bottom: 0 }}>
                    <XAxis type="number" fontSize={8} hide />
                    <YAxis type="category" dataKey="name" width={80} fontSize={8} interval={0} axisLine={false} tickLine={false} />
                    <Tooltip wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="count" fill="#8884d8" name="Count" barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
               {/* Events */}
               <div>
                 <h5 className="text-sm font-medium text-center text-gray-600 mb-1">Events</h5>
                 {/* Add null check for statsData.popularity.events */}
                 <ResponsiveContainer width="100%" height={Math.max(60, (statsData?.popularity?.events?.length ?? 0) * 20)}>
                   <BarChart data={statsData?.popularity?.events ?? []} layout="vertical" margin={{ top: 0, right: 25, left: 50, bottom: 0 }}>
                     <XAxis type="number" fontSize={8} hide />
                     <YAxis type="category" dataKey="name" width={80} fontSize={8} interval={0} axisLine={false} tickLine={false} />
                     <Tooltip wrapperStyle={{ fontSize: '10px' }} />
                     <Bar dataKey="count" fill="#ffc658" name="Count" barSize={10} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               {/* Discounts */}
               <div>
                 <h5 className="text-sm font-medium text-center text-gray-600 mb-1">Discounts</h5>
                 {/* Add null check for statsData.popularity.discounts */}
                 <ResponsiveContainer width="100%" height={Math.max(60, (statsData?.popularity?.discounts?.length ?? 0) * 20)}>
                   <BarChart data={statsData?.popularity?.discounts ?? []} layout="vertical" margin={{ top: 0, right: 25, left: 50, bottom: 0 }}>
                     <XAxis type="number" fontSize={8} hide />
                     <YAxis type="category" dataKey="name" width={80} fontSize={8} interval={0} axisLine={false} tickLine={false} />
                     <Tooltip wrapperStyle={{ fontSize: '10px' }} />
                     <Bar dataKey="count" fill="#ff7300" name="Count" barSize={10} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      )}
      {/* --- End Charts Section --- */}
    </div>
  );
};

export default StatisticsPage;