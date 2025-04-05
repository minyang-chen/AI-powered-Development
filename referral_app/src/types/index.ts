export interface ReferralFormData {
  companyName: string;
  industry?: string; // Optional
  contactName: string;
  contactEmail: string;
  contactPhone?: string; // Optional
}

export interface ReferralSuccessResponse {
  referralCode: string;
  instructions: string;
}

export interface ReferralErrorResponse {
  error: string;
}