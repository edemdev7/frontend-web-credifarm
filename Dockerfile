# Stage 1: Build the application
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build --legacy-peer-deps

# Stage 2: Serve the application
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist

# Install serve (a static file server)
RUN npm install -g serve

# Expose the port
EXPOSE 3340

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3340"]