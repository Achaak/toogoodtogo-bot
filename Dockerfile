FROM node:16-alpine
WORKDIR /app
# Copy and download dependencies
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Copy sources into image
COPY . .
EXPOSE 3000
CMD yarn start
