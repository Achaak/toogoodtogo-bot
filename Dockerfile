FROM node:20-alpine
WORKDIR /app
# Copy and download dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm i

# Copy sources into image
COPY . .
EXPOSE 3000
RUN pnpm build
CMD pnpm start
