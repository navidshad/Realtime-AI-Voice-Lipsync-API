# APIKA - AI assistant

APIKA is an AI assistant that helps users on their journey in learning courses. 
It uses OpenAI API to generate content and provides a user-friendly interface.

## Getting started

Install all dependencies with

```shell
# Install FE dependencies
yarn install

# Install BE dependencies
yarn be:install

```

Run the local development server with
```shell
# DEV: Run the app in development mode - runs both FE and BE
yarn dev

# Alternatively, you can run FE and BE separately
# DEV: Run only the FE in development mode
yarn fe

# DEV: Run only the BE in development mode
yarn be

```

Run tests with
```shell
yarn test
```

Run TypeScript check with
```shell
yarn tsc
```

```shell
yarn build
```

## Running app within Docker containers

```shell

# DEV: Build the Docker Development image (2 images FE + BE)
yarn docker:local:build

# DEV: Run the Docker Development image
yarn docker:local:up

# PROD: Build the Docker Production image (BE only - serving also bundle dist/public files)
yarn docker:prod:build

# PROD: Run the Docker Production image
yarn docker:prod:up

# Stop/remove all running containers
yarn docker:down

```

## GCP Deployment

We have 2 instances running on GCP: 
- DEV: apika-ai-assistant-dev
TBD
- MAIN: apika-ai-assistant-main
https://apika-ai-assistant-main-3416612702.us-central1.run.app

```shell

