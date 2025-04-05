import React, { useState } from 'react';
import ReferralForm from '../components/ReferralForm';
import { submitReferral } from '../services/api';
import type { ReferralSuccessResponse, ReferralErrorResponse } from '../types';

const GeneratorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ReferralErrorResponse | null>(null);
  const [successData, setSuccessData] = useState<ReferralSuccessResponse | null>(null);

  const handleFormSubmitStart = () => {
    setIsLoading(true);
    setError(null);
    setSuccessData(null);
  };

  const handleFormSubmitSuccess = (data: ReferralSuccessResponse) => {
    setIsLoading(false);
    setSuccessData(data);
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
  };

  return (
    <div className="w-full max-w-xl space-y-8 mx-auto">
      {/* Header specific to this page */}
      <div className="text-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-[100px] w-[100px] text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Referral Code Generator
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your company details to receive a unique referral code.
        </p>
      </div>

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
          <button
            onClick={handleReset}
            className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Another Code
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneratorPage;