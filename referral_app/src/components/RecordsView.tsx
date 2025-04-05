import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReferralRecords } from '../services/api';
import type { StoredReferralRecord } from '../services/api'; // Import the type

const RecordsView: React.FC = () => {
  const [records, setRecords] = useState<StoredReferralRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReferralRecords();
        // Sort records by timestamp, newest first
        data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecords(data);
      } catch (err: any) {
        setError(err?.error || 'Failed to load records.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Generated Referral Records</h2>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Form
        </Link>
      </div>

      {loading && <p className="text-center text-gray-600">Loading records...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {!loading && !error && records.length === 0 && (
        <p className="text-center text-gray-500">No records found yet.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
                {/* Add other fields as needed */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.referralCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.contactName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.contactEmail}</td>
                  {/* Render other fields */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecordsView;