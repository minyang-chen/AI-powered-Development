import type { NextApiRequest, NextApiResponse } from 'next';
import { confirmSubscription } from '@/lib/subscriptionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const { token } = req.query;
    
    if (!token || Array.isArray(token)) {
      return res.status(400).json({ success: false, message: 'Valid token is required' });
    }
    
    const result = await confirmSubscription(token);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Confirmation error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
