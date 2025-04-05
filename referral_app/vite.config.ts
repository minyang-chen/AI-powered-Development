import { defineConfig, ProxyOptions } from 'vite'; // Import ProxyOptions
import react from '@vitejs/plugin-react';
import * as http from 'http'; // Import http for types

// https://vite.dev/config/
import type { ReferralFormData, ReferralSuccessResponse } from './src/types'; // Import types

// Basic email regex
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
// Define the structure for stored records
interface StoredReferralRecord extends ReferralFormData {
  referralCode: string;
  instructions: string;
  timestamp: string; // Add a timestamp for context
}

// In-memory store for the dev server simulation
const recordsStore: StoredReferralRecord[] = [];

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api
      '/api': {
        // We don't need a real target, we'll bypass and handle the response ourselves
        target: 'http://localhost:5173', // Target is needed but won't be hit due to bypass
        changeOrigin: true,
        bypass: (req: http.IncomingMessage, res: http.ServerResponse | undefined, _options?: ProxyOptions) => { // Removed explicit return type annotation
          // --- Handle GET /api/records ---
          if (req.method === 'GET' && req.url === '/api/records') {
            if (!res) return;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(recordsStore));
            return; // Signal request handled
          }

          // --- Handle POST /api/referrals ---
          if (req.method === 'POST' && req.url === '/api/referrals') {
            let body = '';
            req.on('data', (chunk: Buffer) => { // Explicitly type chunk as Buffer
              body += chunk.toString(); // Read the request body
            });
            req.on('end', () => {
              try {
                const formData = JSON.parse(body) as ReferralFormData;

                // Basic Server-Side Validation Simulation
                if (!formData.companyName || !formData.contactName || !formData.contactEmail) {
                  if (!res) return; // Guard against undefined res
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing required fields (CompanyName, ContactName, ContactEmail).' }));
                  return; // Stop processing
                }
                if (!emailRegex.test(formData.contactEmail)) {
                  if (!res) return; // Guard against undefined res
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Invalid email format provided.' }));
                   return; // Stop processing
                }

                // Simulate Success
                const successData: ReferralSuccessResponse = {
                   referralCode: `REF-${formData.companyName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                   instructions: `Share this code with new subscribers associated with ${formData.companyName}. They will receive a 10% discount on their first month when using this code during signup.`
                };

                // Store the record (form data + success data)
                const newRecord: StoredReferralRecord = {
                  ...formData,
                  ...successData,
                  timestamp: new Date().toISOString(),
                };
                recordsStore.push(newRecord);
                console.log(`Record added. Total records: ${recordsStore.length}`); // Log to server console

                // Send response
                if (!res) return; // Guard against undefined res
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(successData));

              } catch (e) {
                // Handle JSON parsing error or other issues
                if (!res) return; // Guard against undefined res
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server simulation error.' }));
              }
            });
            // Don't return anything here; the response is handled asynchronously.
            // Returning undefined implicitly signals bypass handled it.
            return; // Explicitly return undefined (or just let it fall through)
          }
          // Let other non-matching requests pass through normally (if any)
          return undefined;
        },
      },
    },
  },
})
