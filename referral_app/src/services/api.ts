import axios from 'axios';
import type { ReferralFormData, ReferralSuccessResponse, ReferralErrorResponse, ReferralRecord, SendEmailPayload, SendEmailResponse, StatisticsResponse } from '../types'; // Added StatisticsResponse

// Old StoredReferralRecord interface removed

const SUBMIT_ENDPOINT = '/api/referrals';
const RECORDS_ENDPOINT = '/api/records';
const SEND_EMAIL_ENDPOINT = '/api/sendemail'; // Renamed endpoint
const STATISTICS_ENDPOINT = '/api/statistics'; // New endpoint
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
 * Fetches all referral records from the backend.
 * @returns A promise that resolves with an array of referral records.
 */
export const getReferralRecords = async (): Promise<ReferralRecord[]> => {
  try {
    // Fetch data matching the ReferralRecord interface
    const response = await axios.get<ReferralRecord[]>(RECORDS_ENDPOINT);
    return response.data;
  } catch (error) {
    // Handle potential errors during fetching records
    console.error('Error fetching referral records:', error);
    // Depending on requirements, you might want to throw a specific error or return an empty array
    throw { error: 'Failed to fetch records. Please try again.' }; // Or return [];
  }
};

/**
 * Sends the referral code and instructions to a list of emails via the backend.
 * @param payload Data containing referral code, instructions, and email list.
 * @returns A promise that resolves with the success message or rejects with an error.
 */
export const sendReferralEmail = async (payload: SendEmailPayload): Promise<SendEmailResponse> => {
  try {
    const response = await axios.post<SendEmailResponse>(SEND_EMAIL_ENDPOINT, payload); // Uses renamed constant
    return response.data;
  } catch (error) {
    console.error('Error sending referral email:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Assuming backend sends { error: string } on failure
      throw error.response.data as ReferralErrorResponse;
    } else {
      throw { error: 'An unexpected error occurred while sending email.' } as ReferralErrorResponse;
    }
  }
};

/**
 * Fetches calculated statistics data from the backend.
 * @returns A promise that resolves with the statistics data.
 */
export const getStatistics = async (): Promise<StatisticsResponse> => {
  // Add cache-busting query parameter
  const cacheBuster = `?t=${Date.now()}`;
  try {
    const response = await axios.get<StatisticsResponse>(`${STATISTICS_ENDPOINT}${cacheBuster}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ReferralErrorResponse;
    } else {
      throw { error: 'An unexpected error occurred while fetching statistics.' } as ReferralErrorResponse;
    }
  }
};