FROM node:14-alpine

# Create a working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Node.js application code to the container
COPY . .

# Expose port 3000 for the Node.js application
EXPOSE 3000

# Set the AWS access key ID and secret access key as environment variables
ENV AWS_ACCESS_KEY_ID=<your-access-key-id>
ENV AWS_SECRET_ACCESS_KEY=<your-secret-access-key>

# Start the Node.js application
CMD ["node", "app.js"]