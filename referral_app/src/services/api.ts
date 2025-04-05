import axios from 'axios';
import type { ReferralFormData, ReferralSuccessResponse, ReferralErrorResponse } from '../types';

// Define the structure for stored records (should match vite.config.ts simulation)
export interface StoredReferralRecord extends ReferralFormData {
  referralCode: string;
  instructions: string;
  timestamp: string;
}

const SUBMIT_ENDPOINT = '/api/referrals';
const RECORDS_ENDPOINT = '/api/records';

/**
 * Submits the referral form data to the backend.
 * @param formData The data collected from the referral form.
 * @returns A promise that resolves with the success response or rejects with an error response.
 */
export const submitReferral = async (formData: ReferralFormData): Promise<ReferralSuccessResponse> => {
  try {
    const response = await axios.post<ReferralSuccessResponse>(SUBMIT_ENDPOINT, formData);
    // Axios throws for non-2xx status codes by default,
    // so if we reach here, it's a success (status 200-299)
    return response.data;
  } catch (error) {
    // Handle Axios errors (network, non-2xx status codes)
    if (axios.isAxiosError(error) && error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // We assume the backend sends a ReferralErrorResponse structure on error
      throw error.response.data as ReferralErrorResponse;
    } else {
      // Something happened in setting up the request that triggered an Error
      // or a non-Axios error occurred.
      console.error('Error submitting referral:', error);
      throw { error: 'An unexpected error occurred. Please try again.' } as ReferralErrorResponse;
    }
  }
};

/**
 * Fetches all stored referral records from the backend simulation.
 * @returns A promise that resolves with an array of stored records.
 */
export const getReferralRecords = async (): Promise<StoredReferralRecord[]> => {
  try {
    const response = await axios.get<StoredReferralRecord[]>(RECORDS_ENDPOINT);
    return response.data;
  } catch (error) {
    // Handle potential errors during fetching records
    console.error('Error fetching referral records:', error);
    // Depending on requirements, you might want to throw a specific error or return an empty array
    throw { error: 'Failed to fetch records. Please try again.' }; // Or return [];
  }
};