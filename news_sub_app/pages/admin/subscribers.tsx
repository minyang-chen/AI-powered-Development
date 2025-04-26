import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import Notification from '@/components/ui/Notification';
import { Subscriber } from '@/types/index';

export default function Subscribers() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  useEffect(() => {
    const adminKey = localStorage.getItem('admin-key');
    if (!adminKey) {
      router.push('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    fetchSubscribers();
  }, [router]);
  
  const fetchSubscribers = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/subscribers', {
        headers: {
          'X-Admin-Key': localStorage.getItem('admin-key') || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.data.subscribers);
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to fetch subscribers',
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'An error occurred while fetching subscribers',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      unsubscribed: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${
          colors[status as keyof typeof colors]
        }`}
      >
        {status}
      </span>
    );
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect to admin login
  }
  
  return (
    <MainLayout title="Manage Subscribers | Amazon Q Developer News">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Subscribers</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-white bg-amazon-blue rounded-md hover:bg-opacity-90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        
        {notification && (
          <div className="mb-6">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subscriber List</h2>
            <button
              onClick={fetchSubscribers}
              className="px-4 py-2 text-white bg-amazon-teal rounded-md hover:bg-opacity-90 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-orange"></div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No subscribers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subscription Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Confirmation Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Email Sent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.email}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(subscriber.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(subscriber.subscriptionDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(subscriber.confirmationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(subscriber.lastEmailSentDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
