import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllEmails, getEmailById } from '@/lib/emailSimulator';

// Simple admin auth middleware (replace with proper auth in production)
const isAdmin = (req: NextApiRequest): boolean => {
  // For local testing, we'll use a simple header-based auth
  const adminKey = req.headers['x-admin-key'];
  return adminKey === 'local-admin-key';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin auth
  if (!isAdmin(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const { id } = req.query;
    
    if (id && !Array.isArray(id)) {
      // Get specific email
      const email = getEmailById(id);
      
      if (!email) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }
      
      return res.status(200).json({ success: true, email });
    } else {
      // Get all emails
      const emails = getAllEmails();
      return res.status(200).json({ success: true, emails });
    }
  } catch (error: any) {
    console.error('Admin emails error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
