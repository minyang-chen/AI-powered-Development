import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import Notification from '@/components/ui/Notification';
import Link from 'next/link';

export default function Unsubscribe() {
  const router = useRouter();
  const { token } = router.query;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your unsubscribe request...');
  
  useEffect(() => {
    if (!token) return;
    
    const processUnsubscribe = async () => {
      try {
        const response = await fetch(`/api/unsubscribe?token=${token}`);
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
        setMessage('An error occurred while processing your request.');
      }
    };
    
    processUnsubscribe();
  }, [token]);
  
  return (
    <MainLayout title="Unsubscribe | Amazon Q Developer News">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Unsubscribe</h1>
        
        {status === 'loading' && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-orange"></div>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <Notification type="info" message={message} autoClose={false} />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">You've Been Unsubscribed</h2>
              <p className="mb-6">
                We're sorry to see you go. If you change your mind, you can always subscribe again.
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
                If you continue to experience issues, please try again later.
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
