FROM node:16-alpine
WORKDIR /app
# Copy and download dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm --frozen-lockfile

# Copy sources into image
COPY . .
EXPOSE 3000
RUN pnpm build
CMD pnpm start
