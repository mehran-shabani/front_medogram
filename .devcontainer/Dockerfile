# Use the official Node.js 20 image as base
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# Install additional system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    htop \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose ports
EXPOSE 3000 5173

# Set environment variables
ENV NODE_ENV=development
ENV VITE_API_BASE_URL=https://api.medogram.ir
ENV VITE_LOCAL_API_URL=https://api.medogram.ir

# Default command
CMD ["npm", "run", "dev"]