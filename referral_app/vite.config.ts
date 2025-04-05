import { defineConfig, Plugin } from 'vite'; // Import Plugin type
import react from '@vitejs/plugin-react';
import * as http from 'http'; // Import http for types
import * as fs from 'fs'; // Import file system module
import * as path from 'path'; // Import path module

// https://vite.dev/config/
import type { ReferralFormData, ReferralSuccessResponse, ReferralRecord, SendEmailPayload, SendEmailResponse, StatisticsResponse } from './src/types'; // Import all needed types including StatisticsResponse

// Basic email regex
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
// StoredReferralRecord interface removed, using ReferralRecord from types

// File path for storing records
const RECORDS_FILE_PATH = path.resolve(__dirname, 'records.json');

// Function to read records from file
const loadRecordsFromFile = (): ReferralRecord[] => {
  try {
    if (fs.existsSync(RECORDS_FILE_PATH)) {
      const fileContent = fs.readFileSync(RECORDS_FILE_PATH, 'utf-8');
      console.log(`Loaded records from ${RECORDS_FILE_PATH}`);
      return JSON.parse(fileContent) as ReferralRecord[];
    } else {
       console.log(`${RECORDS_FILE_PATH} not found, starting with empty store.`);
    }
  } catch (error) {
    console.error("Error loading records from file:", error);
  }
  return []; // Return empty array if file doesn't exist or error occurs
};

// Function to write records to file
const saveRecordsToFile = (records: ReferralRecord[]) => {
  try {
    fs.writeFileSync(RECORDS_FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
    console.log(`Records saved to ${RECORDS_FILE_PATH} (${records.length} total)`);
  } catch (error) {
    console.error("Error saving records to file:", error);
  }
};

// --- Custom Vite Plugin for API Simulation ---
function apiSimulationMiddleware(): Plugin {
  return {
    name: 'api-simulation-middleware',
    configureServer(server) {
      // Initialize store by loading from file when server configures
      let recordsStore: ReferralRecord[] = loadRecordsFromFile();
      console.log(`Initialized recordsStore with ${recordsStore.length} records.`);

      // Middleware to handle API requests
      server.middlewares.use(async (req, res, next) => {
        // --- Handle GET /api/records ---
        if (req.method === 'GET' && req.url === '/api/records') {
          console.log("Middleware handling GET /api/records");
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(recordsStore));
          return; // Stop further processing
        }

        // --- Handle POST /api/referrals ---
        if (req.method === 'POST' && req.url === '/api/referrals') {
          console.log("Middleware handling POST /api/referrals");
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const formData = JSON.parse(body) as ReferralFormData;
              // Basic Validation
              if (!formData.companyName || !formData.contactName || !formData.contactEmail || !emailRegex.test(formData.contactEmail)) {
                 res.statusCode = 400;
                 res.setHeader('Content-Type', 'application/json');
                 res.end(JSON.stringify({ error: 'Missing required fields or invalid email.' }));
                 return;
              }
              // Generate data
              const discount = formData.discountPercentage ?? 0;
              const discountText = discount > 0 ? ` They will receive a ${discount}% discount on their first month` : '';
              const instructions = `Share this code with new subscribers associated with ${formData.companyName}.${discountText} when using this code during signup.`;
              const successData: ReferralSuccessResponse = {
                 referralCode: `REF-${formData.companyName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                 instructions: instructions
              };
              const newRecord: ReferralRecord = {
                 ...formData, ...successData,
                 id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
                 createdAt: new Date().toISOString(),
              };
              // Save and respond
              recordsStore.push(newRecord);
              saveRecordsToFile(recordsStore); // Re-added file saving call
              // console.log(`Record added and saved. Total records: ${recordsStore.length}`); // Log moved to saveRecordsToFile
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(successData));
            } catch (e) {
              console.error("Error in POST /api/referrals middleware:", e);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal server simulation error.' }));
            }
          });
          return; // Stop further processing (request handled async)
        }

        // --- Handle POST /api/sendemail ---
        if (req.method === 'POST' && req.url === '/api/sendemail') {
           console.log("Middleware handling POST /api/sendemail");
           let body = '';
           req.on('data', chunk => { body += chunk.toString(); });
           req.on('end', () => {
             try {
               const payload = JSON.parse(body) as SendEmailPayload;
               console.log(`\n--- SIMULATING EMAIL SEND (Middleware) ---`);
               console.log(`Sending to: ${payload.emails.join(', ')}`);
               console.log(`--- END SIMULATION ---\n`);
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({ message: `Simulated sending email to ${payload.emails.length} address(es).` } as SendEmailResponse));
             } catch (e) {
               console.error("Error in POST /api/sendemail middleware:", e);
               res.statusCode = 500;
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({ error: 'Internal server simulation error during email send.' }));
             }
           });
           return; // Stop further processing (request handled async)
        }

        // --- Handle GET /api/statistics ---
        if (req.method === 'GET' && req.url?.startsWith('/api/statistics')) {
           console.log(`Middleware handling GET /api/statistics for URL: ${req.url}`);
           try {
             // Restore the full calculation logic here
             type StringCountMap = Record<string, number>;
             const timeSeries: { daily: StringCountMap; weekly: StringCountMap; monthly: StringCountMap } = { daily: {}, weekly: {}, monthly: {} };
             const companyCounts: Record<string, number> = {};
             const popularity: { industry: StringCountMap; event: StringCountMap; discount: StringCountMap } = { industry: {}, event: {}, discount: {} };

             recordsStore.forEach(record => {
               const date = new Date(record.createdAt);
               const day = date.toISOString().split('T')[0];
               const year = date.getFullYear();
               const week = `${year}-W${Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`;
               const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
               timeSeries.daily[day] = (timeSeries.daily[day] || 0) + 1;
               timeSeries.weekly[week] = (timeSeries.weekly[week] || 0) + 1;
               timeSeries.monthly[month] = (timeSeries.monthly[month] || 0) + 1;
               companyCounts[record.companyName] = (companyCounts[record.companyName] || 0) + 1;
               if (record.industry) popularity.industry[record.industry] = (popularity.industry[record.industry] || 0) + 1;
               if (record.eventDescription) popularity.event[record.eventDescription] = (popularity.event[record.eventDescription] || 0) + 1;
               if (record.discountPercentage !== undefined && record.discountPercentage !== null) {
                 const discountKey = `${record.discountPercentage}%`;
                 popularity.discount[discountKey] = (popularity.discount[discountKey] || 0) + 1;
               }
             });
             const topCompanies = Object.entries(companyCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([name, count]) => ({ name, count }));
             const popularIndustries = Object.entries(popularity.industry).sort(([, a], [, b]) => b - a).slice(0, 10).map(([name, count]) => ({ name, count }));
             const popularEvents = Object.entries(popularity.event).sort(([, a], [, b]) => b - a).slice(0, 10).map(([name, count]) => ({ name, count }));
             const popularDiscounts = Object.entries(popularity.discount).sort(([, a], [, b]) => b - a).slice(0, 10).map(([name, count]) => ({ name, count }));
             const statsResponse: StatisticsResponse = {
               timeSeries, topCompanies,
               popularity: { industries: popularIndustries, events: popularEvents, discounts: popularDiscounts },
               totalRecords: recordsStore.length
             };
             const responseBody = JSON.stringify(statsResponse, null, 2);
             console.log("--- /api/statistics (Middleware) Calculated Stats ---", responseBody); // Log calculated stats

             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.end(responseBody);
           } catch (e) {
              console.error("Error in GET /api/statistics middleware:", e);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal server simulation error during statistics calculation.' }));
           }
           return; // Stop further processing
        }

        // --- Handle GET /api/export/records ---
        if (req.method === 'GET' && req.url === '/api/export/records') {
          console.log("Middleware handling GET /api/export/records");
          try {
            // Basic CSV Formatting (adjust columns/escaping as needed)
            // Define headers excluding instructions
            const headers = [
              "id", "createdAt", "referralCode", "companyName", "industry",
              "contactName", "contactEmail", "contactPhone",
              "discountPercentage", "eventDescription"
            ];
            const csvHeader = headers.join(',') + '\\n';
            const csvRows = recordsStore.map(record => {
              // Simple escaping for potential commas in strings
              const escape = (str: string | undefined | null) => str ? `"${String(str).replace(/"/g, '""')}"` : '';
              return [
                escape(record.id),
                escape(record.createdAt),
                escape(record.referralCode),
                escape(record.companyName),
                escape(record.industry),
                escape(record.contactName),
                escape(record.contactEmail),
                escape(record.contactPhone),
                record.discountPercentage ?? '', // Handle potential null/undefined
                escape(record.eventDescription)
                // Removed instructions field
              ].join(',');
            }).join('\\n');

            const csvContent = csvHeader + csvRows;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/csv');
            // Set header to trigger download
            res.setHeader('Content-Disposition', 'attachment; filename="referral_records.csv"');
            res.end(csvContent);

          } catch (e) {
             console.error("Error processing /api/export/records:", e);
             res.statusCode = 500;
             res.setHeader('Content-Type', 'application/json');
             res.end(JSON.stringify({ error: 'Internal server simulation error during export.' }));
          }
          return; // Stop further processing
        }

        // If URL doesn't match API paths, pass to next middleware (Vite's default handling)
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    // Custom plugin for API simulation middleware
    apiSimulationMiddleware()
  ],
  server: {
    hmr: {
      // Attempt to explicitly set HMR port if auto-detection fails
      // Use the same port as the main server unless configured differently
      port: 5173, // Or change if your main server port is different
    },
    // Proxy configuration removed - using custom plugin middleware instead
  },
})
