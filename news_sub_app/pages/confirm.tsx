import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import Notification from '@/components/ui/Notification';
import Link from 'next/link';

export default function Confirm() {
  const router = useRouter();
  const { token } = router.query;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your subscription...');
  
  useEffect(() => {
    if (!token) return;
    
    const confirmSubscription = async () => {
      try {
        const response = await fetch(`/api/confirm?token=${token}`);
        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while confirming your subscription.');
      }
    };
    
    confirmSubscription();
  }, [token]);
  
  return (
    <MainLayout title="Confirm Subscription | Amazon Q Developer News">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Subscription Confirmation</h1>
        
        {status === 'loading' && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-orange"></div>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <Notification type="success" message={message} autoClose={false} />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Thank You for Subscribing!</h2>
              <p className="mb-6">
                You will now receive updates about Amazon Q Developer features, best practices, and tips.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-amazon-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <Notification type="error" message={message} autoClose={false} />
            <div className="mt-8">
              <p className="mb-6">
                If you continue to experience issues, please try subscribing again.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-amazon-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
