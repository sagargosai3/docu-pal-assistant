# Use an official Node.js runtime as a parent image
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Bundle app source
COPY . .

# Your app binds to port 8080
EXPOSE 8080
CMD [ "node", "server.js" ] 