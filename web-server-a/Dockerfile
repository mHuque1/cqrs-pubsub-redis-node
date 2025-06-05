# Use Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything early
COPY . .

# Install dependencies
RUN npm ci

RUN ls -l prisma && cat prisma/schema.prisma

# Generate Prisma client (after schema is present)
RUN npx prisma generate


# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
