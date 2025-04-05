import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReferralRecords } from '../services/api';
import type { ReferralRecord } from '../types'; // Import the correct type

// Define type for sorting configuration
type SortConfig = {
  key: keyof ReferralRecord | null; // Key to sort by (allow null for initial state)
  direction: 'ascending' | 'descending';
};

const RecordsView: React.FC = () => {
  // State now holds records grouped by company name
  const [groupedRecords, setGroupedRecords] = useState<Record<string, ReferralRecord[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' }); // Default sort
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const RECORDS_PER_PAGE = 10; // Increased page size
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ReferralRecord | null | 'not_found'>(null); // null: initial, Record: found, 'not_found': not found
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawData = await getReferralRecords();

        // Group by company name
        const grouped = rawData.reduce((acc, record) => {
          const company = record.companyName;
          if (!acc[company]) {
            acc[company] = [];
          }
          acc[company].push(record);
          return acc;
        }, {} as Record<string, ReferralRecord[]>);

        // Sort records within each group based on sortConfig
        if (sortConfig.key !== null) {
          for (const company in grouped) {
            grouped[company].sort((a, b) => {
              const aValue = a[sortConfig.key!]; // Use non-null assertion as key is checked
              const bValue = b[sortConfig.key!];

              // Handle different types (add more as needed)
              if (sortConfig.key === 'createdAt') {
                // Date comparison
                const dateA = new Date(aValue as string).getTime();
                const dateB = new Date(bValue as string).getTime();
                if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
              } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                 // Numeric comparison (e.g., discountPercentage)
                 if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                 if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                 return 0;
              } else {
                // Default to string comparison (case-insensitive)
                const strA = String(aValue ?? '').toLowerCase();
                const strB = String(bValue ?? '').toLowerCase();
                if (strA < strB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (strA > strB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
              }
            });
          }
        }

        setGroupedRecords(grouped); // Use the new state setter
      } catch (err: any) {
        setError(err?.error || 'Failed to load records.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [sortConfig]); // Re-run effect when sortConfig changes

  // Function to handle sorting requests from table headers
  const requestSort = (key: keyof ReferralRecord) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    // If clicking the same key, reverse the direction
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // --- Pagination Logic ---
  // Flatten the grouped and sorted records into a single array for pagination display logic
  // Note: This flattens AFTER grouping/sorting, so the order within companies is preserved.
  const flattenedRecords = Object.values(groupedRecords).flat();
  const totalRecords = flattenedRecords.length;
  const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);

  // Calculate the records to display on the current page
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentRecords = flattenedRecords.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // --- Search Logic ---
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResult(null); // Clear search if term is empty
      return;
    }
    // Search within the flattened records (case-insensitive)
    const found = flattenedRecords.find(
      record => record.referralCode.toLowerCase() === searchTerm.trim().toLowerCase()
    );
    setSearchResult(found || 'not_found'); // Set result or 'not_found'
  };
  // --- End Search Logic ---
// Chart data processing logic removed - moved to StatisticsPage.tsx

{/* Removed duplicate return statement */}
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">

      {/* Chart placeholder section removed - moved to StatisticsPage.tsx */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Generated Referral Records</h2> {/* Reduced font size */}
        {/* "Back to Form" link removed */}
      </div>

      {/* --- Search Section --- */}
      <div className="mb-8 flex items-center gap-x-3"> {/* Increased bottom margin */}
        <label htmlFor="searchCode" className="sr-only">Search by Code</label> {/* Screen reader only label */}
        <input
          type="text"
          id="searchCode"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Referral Code..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleSearch} // Connect search handler
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Find
        </button>
      </div>
      {/* --- End Search Section --- */}

      {loading && <p className="text-center text-gray-600">Loading records...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {/* Check if the groupedRecords object is empty */}
      {!loading && !error && Object.keys(groupedRecords).length === 0 && (
        <p className="text-center text-gray-500">No records found yet.</p>
      )}

      {/* --- Display Area: Search Result or Paginated Table --- */}
      { /* Start of conditional rendering block */
        searchResult === 'not_found' ? (
        <p className="text-center text-red-500 mt-4">Referral code not found.</p>
      ) : searchResult ? (
        // Display Single Search Result
        <div className="mt-6 border-t pt-4">
           <h3 className="text-lg font-semibold mb-3">Search Result:</h3>
           <div className="bg-gray-50 p-4 rounded shadow">
             {/* Display details of the found record */}
             {(() => {
               // Assign to new const to help TS type inference within this block
               const foundRecord = searchResult as ReferralRecord; // Type assertion needed here because TS struggles with the outer ternary
               return <>
                 <p><strong>Referral Code:</strong> {foundRecord.referralCode}</p>
                 <p><strong>Company:</strong> {foundRecord.companyName}</p>
                 <p><strong>Contact:</strong> {foundRecord.contactName} ({foundRecord.contactEmail})</p>
                 <p><strong>Date Created:</strong> {new Date(foundRecord.createdAt).toLocaleString()}</p>
                 <p><strong>Discount:</strong> {foundRecord.discountPercentage ?? 'N/A'}%</p>
                 <p><strong>Industry:</strong> {foundRecord.industry ?? 'N/A'}</p>
                 <p><strong>Phone:</strong> {foundRecord.contactPhone ?? 'N/A'}</p>
                 <p><strong>Event:</strong> {foundRecord.eventDescription ?? 'N/A'}</p>
               </>;
             })()}
           </div>
           <button
             onClick={() => { setSearchTerm(''); setSearchResult(null); }} // Clear search
             className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
           >
             Show All Records
           </button>
        </div>
      ) : (
        // Display Paginated Table if no search is active/found
        <> {/* Wrap existing table and pagination in fragment */}
          {/* Check if there are records to display */}
      {!loading && !error && totalRecords > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Updated Headers */}
                {/* Add Company Name Header */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('companyName')}>
                  Company Name {sortConfig.key === 'companyName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                {/* Add onClick, hover styles, and sort indicator */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('createdAt')}>
                  Date Created {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('referralCode')}>
                  Referral Code {sortConfig.key === 'referralCode' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('contactName')}>
                  Contact Name {sortConfig.key === 'contactName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('contactEmail')}>
                  Contact Email {sortConfig.key === 'contactEmail' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('discountPercentage')}>
                  Discount (%) {sortConfig.key === 'discountPercentage' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('industry')}>
                  Industry {sortConfig.key === 'industry' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('contactPhone')}>
                  Contact Phone {sortConfig.key === 'contactPhone' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer" onClick={() => requestSort('eventDescription')}>
                  Event Description {sortConfig.key === 'eventDescription' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            {/* Iterate over records for the current page */}
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((record: ReferralRecord) => (
                 <tr key={record.id} className="hover:bg-gray-50">
                   {/* Add Company Name column back since grouping header is removed */}
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.companyName}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.createdAt).toLocaleString()}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.referralCode}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.contactName}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.contactEmail}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{record.discountPercentage ?? 'N/A'}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.industry ?? 'N/A'}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.contactPhone ?? 'N/A'}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.eventDescription ?? 'N/A'}</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} {/* Closing the conditional rendering block for the table */}

        {/* --- Pagination Controls --- */}
        {totalRecords > RECORDS_PER_PAGE && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, totalRecords)}</span> of{' '}
              <span className="font-medium">{totalRecords}</span> results
            </div>
            <div className="flex gap-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* --- End Pagination Controls --- */}
        </> // Close fragment wrapping table and pagination
      ) /* Closing parenthesis for the main searchResult ternary */
      } {/* Closing brace for the embedded JS expression */}
    </div>
  );
};

export default RecordsView;