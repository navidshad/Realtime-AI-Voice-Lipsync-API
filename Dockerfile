FROM node:20-alpine as frontend-builder
WORKDIR /frontend
COPY package.json yarn.lock ./
COPY . .
RUN yarn install --frozen-lockfile
ENV NODE_ENV=production
ENV NODE_MODE=build
ENV PATH /frontend/node_modules/.bin:$PATH
ARG APIKA_APP_URL
ENV APIKA_APP_URL=${APIKA_APP_URL}
RUN NODE_ENV=production yarn build

FROM node:20-alpine as production
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY server/ ./

RUN mkdir -p dist public

COPY --from=frontend-builder /frontend/dist ./dist
COPY --from=frontend-builder /frontend/public ./public

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Use non-root user for security
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

CMD ["node", "index.js"]