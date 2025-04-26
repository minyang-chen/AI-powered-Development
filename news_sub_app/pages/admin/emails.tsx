import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import Notification from '@/components/ui/Notification';
import { SimulatedEmail } from '@/types/index';

export default function Emails() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emails, setEmails] = useState<SimulatedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(null);
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
    fetchEmails();
  }, [router]);
  
  const fetchEmails = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/emails', {
        headers: {
          'X-Admin-Key': localStorage.getItem('admin-key') || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails.sort((a: SimulatedEmail, b: SimulatedEmail) => 
          new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
        ));
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to fetch emails',
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'An error occurred while fetching emails',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status: string) => {
    const colors = {
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      bounced: 'bg-red-100 text-red-800 border-red-200',
      complained: 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
  
  const viewEmail = (email: SimulatedEmail) => {
    setSelectedEmail(email);
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect to admin login
  }
  
  return (
    <MainLayout title="Email Simulator | Amazon Q Developer News">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Email Simulator</h1>
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
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sent Emails</h2>
              <button
                onClick={fetchEmails}
                className="p-2 text-amazon-teal hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Refresh"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amazon-orange"></div>
              </div>
            ) : emails.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No emails found.
              </div>
            ) : (
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {emails.map((email) => (
                    <li key={email.id}>
                      <button
                        onClick={() => viewEmail(email)}
                        className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedEmail?.id === email.id
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="truncate pr-2">
                            <p className="font-medium truncate">{email.subject}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              To: {email.to}
                            </p>
                          </div>
                          <div>{getStatusBadge(email.status)}</div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(email.sentDate)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Email Preview</h2>
            </div>
            
            {selectedEmail ? (
              <div className="p-4">
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-gray-500 dark:text-gray-400">To:</div>
                    <div className="col-span-2">{selectedEmail.to}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-gray-500 dark:text-gray-400">Subject:</div>
                    <div className="col-span-2 font-medium">{selectedEmail.subject}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-gray-500 dark:text-gray-400">Sent:</div>
                    <div className="col-span-2">{formatDate(selectedEmail.sentDate)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-gray-500 dark:text-gray-400">Status:</div>
                    <div className="col-span-2">{getStatusBadge(selectedEmail.status)}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      className="px-4 py-2 border-b-2 border-amazon-teal font-medium"
                      disabled
                    >
                      HTML
                    </button>
                    <button
                      className="px-4 py-2 text-gray-500 dark:text-gray-400"
                      disabled
                    >
                      Text
                    </button>
                  </div>
                  
                  <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900">
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Select an email to preview its content.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
