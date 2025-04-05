import React, { useState } from 'react';
import ReferralForm from '../components/ReferralForm';
import { submitReferral, sendReferralEmail } from '../services/api'; // Added sendReferralEmail
import type { ReferralSuccessResponse, ReferralErrorResponse, SendEmailPayload } from '../types'; // Added SendEmailPayload

const GeneratorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ReferralErrorResponse | null>(null);
  const [successData, setSuccessData] = useState<ReferralSuccessResponse & { companyName?: string } | null>(null); // Add companyName for context
  // State for email sending feature
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<{ success?: string; error?: string } | null>(null);

  const handleFormSubmitStart = () => {
    setIsLoading(true);
    setError(null);
    setSuccessData(null);
  };

  const handleFormSubmitSuccess = (data: ReferralSuccessResponse) => {
    setIsLoading(false);
    // Need companyName for email context, get it from the form data before reset
    // This assumes the form data is accessible here or passed differently.
    // For now, let's assume it's part of the success response or handled elsewhere.
    // A better approach might be to not reset the form until after email is sent,
    // or store necessary context (like companyName) in state when submission starts.
    // Let's modify the success data structure slightly for this example.
    // NOTE: This requires the API simulation to potentially include companyName if needed.
    // We'll add it manually here for the UI part.
    // A cleaner way would be to lift state or use context.
    setSuccessData({ ...data, companyName: 'Unknown Company' }); // Placeholder - needs real data
    setError(null);
  };

  const handleFormSubmitError = (errorData: ReferralErrorResponse) => {
    setIsLoading(false);
    setError(errorData);
    setSuccessData(null);
  };

  const handleReset = () => {
    setIsLoading(false);
    setError(null);
    setSuccessData(null);
    // Reset email state as well
    setEmailInput('');
    setIsSendingEmail(false);
    setEmailSendStatus(null);
  };

  const handleSendEmail = async () => {
    if (!successData || !emailInput.trim()) return;

    setIsSendingEmail(true);
    setEmailSendStatus(null);

    // Basic email validation (simple split and trim)
    const emails = emailInput.split(',').map(email => email.trim()).filter(email => email.length > 0);
    if (emails.length === 0) {
      setEmailSendStatus({ error: 'Please enter at least one valid email address.' });
      setIsSendingEmail(false);
      return;
    }

    // TODO: Add more robust email validation if needed

    const payload: SendEmailPayload = {
      referralCode: successData.referralCode,
      instructions: successData.instructions,
      companyName: successData.companyName || 'Your Company', // Use placeholder if needed
      emails: emails,
    };

    try {
      // Import the function if not already done at the top
      // import { sendReferralEmail } from '../services/api';
      const result = await sendReferralEmail(payload);
      setEmailSendStatus({ success: result.message || 'Email sent successfully!' });
      setEmailInput(''); // Clear input on success
    } catch (err: any) {
      setEmailSendStatus({ error: err?.error || 'Failed to send email.' });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-8 mx-auto">
      {/* Page-specific header removed as title is now global in App.tsx */}

      {/* Conditional Rendering: Form or Result/Error */}
      {!successData ? (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto mb-6" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error.error}</span>
            </div>
          )}
           {isLoading && (
            <div className="text-center text-gray-600 mb-4">Submitting... Please wait.</div>
          )}
          {/* Instructions added above the form */}
          <p className="text-center text-sm text-gray-600 mb-4 max-w-lg mx-auto">
            Please fill in the details below. Fields marked with <span className="text-red-500">*</span> are required.
          </p>
          <ReferralForm
            onSubmitStart={handleFormSubmitStart}
            onSubmitSuccess={handleFormSubmitSuccess}
            onSubmitError={handleFormSubmitError}
            apiService={submitReferral}
          />
        </>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg relative max-w-lg mx-auto text-center shadow-md">
          <h3 className="text-xl font-semibold mb-4">Success! Your Referral Code:</h3>
          <p className="text-3xl font-bold text-indigo-700 bg-white py-3 px-4 rounded inline-block shadow mb-4">
            {successData.referralCode}
          </p>
          <h4 className="text-lg font-medium mt-6 mb-2">Instructions:</h4>
          <p className="text-base text-gray-800 mb-6">{successData.instructions}</p>

          {/* --- Buttons Section --- */}
          {/* New parent div for flex layout and spacing */}
          <div className="mt-5 flex justify-between items-end">
            {/* --- Email Sending Section (now left item) --- */}
            <div className="pt-6 border-t border-green-300"> {/* Removed mt-6 */}
            <label htmlFor="emailList" className="block text-sm font-medium text-gray-700 mb-1">
              Send code to emails (comma-separated):
            </label>
            <textarea
              id="emailList"
              rows={2}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., user1@example.com, user2@example.com"
              disabled={isSendingEmail}
            />
            <button
              onClick={handleSendEmail} // Connect the handler
              disabled={isSendingEmail || !emailInput.trim()}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </button>
            {/* Email Send Status Messages */}
            {emailSendStatus?.success && (
              <p className="mt-2 text-sm text-green-600">{emailSendStatus.success}</p>
            )}
            {emailSendStatus?.error && (
              <p className="mt-2 text-sm text-red-600">{emailSendStatus.error}</p>
            )}
          </div>
            {/* --- End Email Sending Section --- */}
            {/* Removed extra closing div */}

            {/* --- Generate Another Code Button (now right item) --- */}
            <button
              onClick={handleReset}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" /* Removed mt-4 */
            >
              Generate Another Code
            </button>
          </div> {/* End Buttons Section parent div */}
          {/* Removed extra closing button tag */}
        </div>
      )}
    </div>
  );
};

export default GeneratorPage;