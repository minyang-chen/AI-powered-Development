FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy application files
COPY . .

# Create data directories
RUN mkdir -p ./data/emails ./data/backups ./data/s3

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production
ENV DATA_STORAGE_DIR=./data
ENV SUBSCRIBERS_FILE=subscribers.json
ENV BACKUP_DIR=./data/backups
ENV EMAIL_SIMULATOR_DIR=./data/emails
ENV S3_EMULATION_ENABLED=true
ENV S3_EMULATION_DIR=./data/s3

# Start the application
CMD ["npm", "run", "start"]
