# Amazon Q Developer News Subscription Application

## Project Overview
A web application that allows users to subscribe to Amazon Q Developer news by entering their email address. The application collects user email addresses, validates them, stores them securely, and provides confirmation to users upon successful subscription.

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Initial Data Storage**: JSON file with S3 backups (emulated locally)
- **Future Data Storage**: Amazon DynamoDB (post-Phase 1)
- **Phase 1 Email Handling**: Email simulator/mock service
- **Phase 2 Email Service**: Amazon SES (Simple Email Service)

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd news_sub_app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables
The application uses the following environment variables, which are set in `.env.local`:

```
# App
APP_URL=http://localhost:3000

# Email Simulator
EMAIL_SIMULATOR_DIR=./data/emails

# Storage
DATA_STORAGE_DIR=./data
SUBSCRIBERS_FILE=subscribers.json
BACKUP_DIR=./data/backups

# S3 Emulation
S3_EMULATION_ENABLED=true
S3_EMULATION_DIR=./data/s3
```

## Deployment

### Local Docker Deployment
1. Build the Docker image:
```bash
docker build -t amazon-q-news-subscription .
```

2. Run the container:
```bash
docker run -p 3000:3000 amazon-q-news-subscription
```

### AWS Lightsail Deployment
1. Make sure you have AWS CLI installed and configured with appropriate credentials.

2. Run the deployment script:
```bash
npm run deploy
```

This will:
- Build the Next.js application
- Create a Docker image
- Create or update an AWS Lightsail container service
- Deploy the application to the container service
- Set up the public endpoint

## Features

### User-Facing Features
1. **Landing Page**
   - Clean, responsive design with Amazon Q Developer branding
   - Brief description of the subscription benefits
   - Email input field with validation
   - Subscribe button
   - Success/error message display

2. **Subscription Process**
   - Real-time email validation (format checking)
   - Double opt-in process (simulated in Phase 1)
   - Success confirmation page/message
   - Error handling with user-friendly messages

3. **Email Management**
   - Unsubscribe link in emails
   - Confirmation and welcome emails (simulated in Phase 1)

### Admin Features
1. **Dashboard**
   - Subscriber count and growth metrics
   - Subscription/unsubscription rates
   - Basic analytics

2. **Email Simulator**
   - View simulated emails sent by the system
   - Preview email content and delivery status

## Implementation Details

### Data Storage
In Phase 1, the application uses a JSON file to store subscriber data:
```json
{
  "subscribers": [
    {
      "email": "example@domain.com",
      "status": "pending",
      "subscriptionDate": "2025-04-26T04:19:27Z",
      "confirmationDate": null,
      "lastEmailSentDate": null,
      "preferences": {},
      "unsubscribeToken": "abc123",
      "confirmationToken": "xyz789"
    }
  ],
  "meta": {
    "lastUpdated": "2025-04-26T04:19:27Z",
    "totalSubscribers": 1,
    "activeSubscribers": 0
  }
}
```

### Email Simulation
Instead of using Amazon SES in Phase 1, the application simulates email sending by:
- Generating email content with HTML and text versions
- Storing "sent" emails as JSON files
- Providing an admin interface to view simulated emails

### S3 Backup Emulation
The application emulates S3 backups by:
- Creating a local directory structure to mimic S3 buckets
- Performing regular backups of the subscribers JSON file
- Maintaining backup history with timestamps

## Admin Access
For local testing, use the admin key: `local-admin-key`

## Implementation Phases

### Phase 1: Initial Implementation
- Next.js with Tailwind CSS frontend
- JSON file storage with S3 backup emulation
- Email simulator for testing subscription flow
- Basic admin interface

### Phase 2: Scaling and Enhancement (Future)
- Migrate data from JSON file to DynamoDB
- Implement Amazon SES for actual email delivery
- Implement CloudWatch monitoring and alerting
- Set up advanced metrics and dashboards
- Implement auto-scaling for containers

## License
This project is licensed under the MIT License - see the LICENSE file for details.
