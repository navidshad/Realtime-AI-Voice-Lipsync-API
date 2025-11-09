FROM node:20-alpine as frontend-builder
WORKDIR /frontend
COPY package.json yarn.lock ./
COPY . .
RUN yarn install
ENV NODE_ENV=production
ENV NODE_MODE=build
ENV PATH /frontend/node_modules/.bin:$PATH
ARG APIKA_APP_URL
ENV APIKA_APP_URL=${APIKA_APP_URL}
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
RUN NODE_ENV=production yarn build

FROM node:20-alpine as production
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --production
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