import type { NextApiRequest, NextApiResponse } from 'next';
import { getStats } from '@/lib/storage';

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
    const stats = getStats();
    return res.status(200).json({ success: true, stats });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
