import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { ReferralFormData, ReferralSuccessResponse, ReferralErrorResponse } from '../types';

interface ReferralFormProps {
  onSubmitStart: () => void; // Callback when submission starts
  onSubmitSuccess: (data: ReferralSuccessResponse) => void; // Callback for successful submission
  onSubmitError: (error: ReferralErrorResponse) => void; // Callback for submission error
  apiService: (formData: ReferralFormData) => Promise<ReferralSuccessResponse>; // API submission function
}

const ReferralForm: React.FC<ReferralFormProps> = ({
  onSubmitStart,
  onSubmitSuccess,
  onSubmitError,
  apiService
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Add reset function
  } = useForm<ReferralFormData>();

  const industryOptions = ['Technology', 'Finance', 'Retail', 'Healthcare', 'Education', 'Other'];

  const onSubmit: SubmitHandler<ReferralFormData> = async (data) => {
    onSubmitStart(); // Notify parent that submission is starting
    try {
      const result = await apiService(data);
      onSubmitSuccess(result);
      reset(); // Clear the form on success
    } catch (error) {
      // Type assertion is safe here based on apiService implementation
      onSubmitError(error as ReferralErrorResponse);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-4/5 mx-auto p-8 bg-white shadow-lg rounded-xl mx-5">
      {/* Heading was removed previously */}
      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-600 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="companyName"
          type="text"
          {...register('companyName', { required: 'Company Name is required' })}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-base transition duration-150 ease-in-out ${errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
        />
        {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>}
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-600 mb-1">
          Industry (Optional)
        </label>
        <select
          id="industry"
          {...register('industry')}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-base bg-white transition duration-150 ease-in-out"
        >
          <option value="">-- Select Industry --</option>
          {industryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {/* No error message needed for optional field */}
      </div>

      {/* Contact Name */}
      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-600 mb-1">
          Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          id="contactName"
          type="text"
          {...register('contactName', { required: 'Contact Name is required' })}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-base transition duration-150 ease-in-out ${errors.contactName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
        />
        {errors.contactName && <p className="mt-1 text-xs text-red-600">{errors.contactName.message}</p>}
      </div>

      {/* Contact Email */}
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-600 mb-1">
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contactEmail"
          type="email"
          {...register('contactEmail', {
            required: 'Contact Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address format',
            },
          })}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-base transition duration-150 ease-in-out ${errors.contactEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
        />
        {errors.contactEmail && <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>}
      </div>

      {/* Contact Phone */}
      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-600 mb-1">
          Contact Phone (Optional)
        </label>
        <input
          id="contactPhone"
          type="tel"
          {...register('contactPhone')}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-base transition duration-150 ease-in-out"
        />
        {/* No error message needed for optional field */}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex justify-center py-14 px-16 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? 'Submitting...' : 'Generate Code'}
        </button>
      </div>
    </form>
  );
};

export default ReferralForm;