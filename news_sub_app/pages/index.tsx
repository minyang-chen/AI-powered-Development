import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import SubscriptionForm from '@/components/ui/SubscriptionForm';
import Notification from '@/components/ui/Notification';

export default function Home() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const handleSuccess = (message: string) => {
    setNotification({
      type: 'success',
      message,
    });
  };
  
  const handleError = (message: string) => {
    setNotification({
      type: 'error',
      message,
    });
  };
  
  const clearNotification = () => {
    setNotification(null);
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Stay Updated with <span className="text-amazon-orange">Amazon Q Developer</span>
          </h1>
          <p className="text-xl mb-8">
            Subscribe to receive the latest news, tips, and best practices for Amazon Q Developer.
          </p>
          
          {notification && (
            <div className="mb-6">
              <Notification
                type={notification.type}
                message={notification.message}
                onClose={clearNotification}
              />
            </div>
          )}
          
          <div className="flex justify-center">
            <SubscriptionForm onSuccess={handleSuccess} onError={handleError} />
          </div>
        </section>
        
        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Latest Features</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Be the first to know about new Amazon Q Developer features and capabilities.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Best Practices</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Learn how to maximize your productivity with Amazon Q Developer.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Community Insights</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover how others are using Amazon Q Developer to solve real-world problems.
            </p>
          </div>
        </section>
        
        <section className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Why Subscribe?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Receive timely updates about new features and improvements</li>
            <li>Get expert tips to enhance your development workflow</li>
            <li>Learn about upcoming webinars and events</li>
            <li>Access exclusive content for subscribers</li>
            <li>Stay ahead with early access opportunities</li>
          </ul>
        </section>
      </div>
    </MainLayout>
  );
}
