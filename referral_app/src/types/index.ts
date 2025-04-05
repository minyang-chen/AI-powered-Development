export interface ReferralFormData {
  companyName: string;
  industry?: string; // Optional
  contactName: string;
  contactEmail: string;
  contactPhone?: string; // Optional
  discountPercentage?: number; // Optional discount percentage
  eventDescription?: string; // Optional event description
}

export interface ReferralSuccessResponse {
  referralCode: string;
  instructions: string;
}

export interface ReferralErrorResponse {
  error: string;
}

// Represents a single referral record fetched from the API
export interface ReferralRecord {
  id: string; // Assuming API provides an ID
  companyName: string;
  industry?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  discountPercentage?: number;
  referralCode: string;
  createdAt: string; // Assuming ISO date string from API (e.g., "2025-04-05T14:30:00Z")
  eventDescription?: string;
}

// Payload for sending referral code via email
export interface SendEmailPayload {
  referralCode: string;
  instructions: string; // Include instructions in the email body
  companyName: string; // For context in the email
  emails: string[]; // List of email addresses to send to
}

// Response type for the email sending API (can be simple)
export interface SendEmailResponse {
  message: string;
}

// Type for chart data points (generic name/value or specific)
export interface ChartDataPoint {
  name: string;
  count: number;
}

// Type for time series data (key is date/week/month string)
export type TimeSeriesData = Record<string, number>;

// Response type for the statistics API
export interface StatisticsResponse {
  timeSeries: {
    daily: TimeSeriesData;
    weekly: TimeSeriesData;
    monthly: TimeSeriesData;
  };
  topCompanies: ChartDataPoint[];
  popularity: {
    industries: ChartDataPoint[];
    events: ChartDataPoint[];
    discounts: ChartDataPoint[];
  };
  totalRecords: number;
}