import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { initStorage } from '@/lib/storage';
import { initEmailSimulator } from '@/lib/emailSimulator';
import { initS3Emulation } from '@/lib/s3Emulation';
import { scheduleBackups } from '@/lib/backupService';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // These will only run on the server side due to the checks in each function
    initStorage();
    initEmailSimulator();
    initS3Emulation();
    
    // Schedule backups (every 60 minutes)
    const backupInterval = scheduleBackups(60);
    
    // Cleanup on unmount
    return () => {
      if (backupInterval) {
        clearInterval(backupInterval);
      }
    };
  }, []);
  
  return <Component {...pageProps} />;
}
