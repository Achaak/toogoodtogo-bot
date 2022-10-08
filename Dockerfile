FROM node:16-alpine
WORKDIR /app
# Copy and download dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the files
COPY . .
# Build the app
RUN npm run build
# Run the app
CMD [ "npm", "start" ]