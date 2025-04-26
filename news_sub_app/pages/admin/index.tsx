import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Notification from '@/components/ui/Notification';
import Link from 'next/link';

type Stats = {
  total: number;
  active: number;
  pending: number;
  unsubscribed: number;
  lastUpdated: string;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminKey) {
      setNotification({
        type: 'error',
        message: 'Admin key is required',
      });
      return;
    }
    
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'X-Admin-Key': adminKey,
        },
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin-key', adminKey);
        fetchStats();
      } else {
        setNotification({
          type: 'error',
          message: 'Invalid admin key',
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'An error occurred during authentication',
      });
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'X-Admin-Key': adminKey || localStorage.getItem('admin-key') || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to fetch stats',
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'An error occurred while fetching stats',
      });
    }
  };
  
  useEffect(() => {
    const storedKey = localStorage.getItem('admin-key');
    if (storedKey) {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
      fetchStats();
    }
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <MainLayout title="Admin Dashboard | Amazon Q Developer News">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {notification && (
          <div className="mb-6">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}
        
        {!isAuthenticated ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="adminKey" className="block mb-2">
                  Admin Key
                </label>
                <input
                  type="password"
                  id="adminKey"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amazon-teal"
                  placeholder="Enter admin key"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-amazon-blue rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-amazon-blue focus:ring-opacity-50 transition-colors"
              >
                Login
              </button>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                For local testing, use: "local-admin-key"
              </p>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Subscriber Statistics</h2>
              {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
                    <p className="text-3xl font-bold text-amazon-blue">{stats.total}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Confirmation</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribed</p>
                    <p className="text-3xl font-bold text-red-600">{stats.unsubscribed}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amazon-orange"></div>
                </div>
              )}
              {stats && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {formatDate(stats.lastUpdated)}
                </p>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/admin/subscribers"
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">Manage Subscribers</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  View and manage your subscriber list
                </p>
              </Link>
              
              <Link
                href="/admin/emails"
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">Email Simulator</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  View simulated emails sent by the system
                </p>
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={fetchStats}
                  className="px-4 py-2 text-white bg-amazon-teal rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Refresh Stats
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('admin-key');
                    setIsAuthenticated(false);
                    setAdminKey('');
                  }}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
