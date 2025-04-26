export type SubscriptionStatus = 'pending' | 'confirmed' | 'unsubscribed';

export interface Subscriber {
  email: string;
  status: SubscriptionStatus;
  subscriptionDate: string;
  confirmationDate: string | null;
  lastEmailSentDate: string | null;
  preferences: {
    frequency?: 'daily' | 'weekly' | 'monthly';
    topics?: string[];
  };
  unsubscribeToken: string;
  confirmationToken: string;
}

export interface SubscribersData {
  subscribers: Subscriber[];
  meta: {
    lastUpdated: string;
    totalSubscribers: number;
    activeSubscribers: number;
  };
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  sentDate: string;
  status: 'sent' | 'delivered' | 'bounced' | 'complained';
}
