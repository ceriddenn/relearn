# Stage 1: Install dependencies and build the application
FROM node:22-alpine AS builder

RUN apk add -f --update --no-cache --virtual .gyp nano bash libc6-compat python3 make g++ \
      && yarn global add turbo \
      && apk del .gyp

# Set the working directory
WORKDIR /relearn

# Copy the root package.json, yarn.lock, and turbo.json
COPY package.json yarn.lock turbo.json ./

# Copy workspace package.json files
COPY apps/api/package.json apps/api/
COPY packages/database/package.json packages/database/

# Install all dependencies using Yarn workspaces
# Copy all source code
COPY . .

RUN yarn install --frozen-lockfile 

# Build the application and dependencies using Turborepo
RUN yarn turbo run build --filter=@relearn/api

# Stage 2: Prepare the production image
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /relearn

# Copy the entire project (excluding unnecessary files via .dockerignore)
COPY --from=builder /relearn/apps/api/package.json ./apps/api/
COPY --from=builder /relearn/apps/api/dist ./apps/api/dist
COPY --from=builder /relearn/packages ./packages
COPY --from=builder /relearn/node_modules ./node_modules

COPY --from=builder /relearn/package.json ./
COPY --from=builder /relearn/yarn.lock ./
COPY --from=builder /relearn/turbo.json ./
# Install production dependencies using Yarn workspaces
RUN yarn install --production --frozen-lockfile

WORKDIR /relearn/apps/api

# Build environment variables (if any)
# ENV NODE_ENV=production

# Expose the application's port
EXPOSE 3010

# Start the application
CMD ["yarn", "start:prod"]
