# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps first (cache-friendly)
COPY package*.json ./
RUN npm ci --only=production

# Copy rest of code
COPY . .

# Set environment variables
ENV NODE_ENV=production
EXPOSE 4000

# Start the server
CMD ["node", "src/index.js"]
