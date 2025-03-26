FROM node:20-alpine as frontend-builder
WORKDIR /frontend
COPY package.json yarn.lock ./
COPY . .
RUN yarn install --frozen-lockfile
ENV NODE_ENV=production
ENV NODE_MODE=build
ENV PATH /frontend/node_modules/.bin:$PATH
ARG APIKA_APP_URL
ENV APIKA_APP_URL=$APIKA_APP_URL

# Debug before build
RUN echo "Environment variables:" && \
    echo "APIKA_APP_URL: $APIKA_APP_URL" && \
    echo "NODE_ENV: $NODE_ENV" && \
    echo "Frontend files before build:" && ls -la

# Run the build
RUN NODE_ENV=production yarn build

# Debug after build
RUN echo "Frontend dist after build:" && ls -la dist/

FROM node:20-alpine as development
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY server/ ./
CMD ["yarn", "start"]

FROM node:20-alpine as production
WORKDIR /app
# Copy server files first
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY server/ ./

# Debug the server files
RUN echo "Final server files:" && ls -la

# Create directories for static files
RUN mkdir -p dist public

# Copy the entire frontend build directories
COPY --from=frontend-builder /frontend/dist ./dist
COPY --from=frontend-builder /frontend/public ./public

# Debug the final structure
RUN echo "Final directory structure:" && \
    ls -la && \
    echo "\nDist contents:" && \
    ls -la dist/ && \
    echo "\nPublic contents:" && \
    ls -la public/ && \
    echo "\nComplete file tree:" && \
    find . -type f

ENV NODE_ENV=production
ENV PORT=3030
EXPOSE 3030
CMD ["node", "index.js"] 