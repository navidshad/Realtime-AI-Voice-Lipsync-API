# APIKA - AI assistant

APIKA is an AI assistant that helps users on their journey in learning courses. 
It uses OpenAI API to generate content and provides a user-friendly interface.

## Getting started

Install all dependencies with
```shell
yarn install
```

Run the local development server with
```shell
yarn dev
```

Run tests with
```shell
yarn test
```


## Getting started INFRA

IMPORTANT: This is just a placeholder for infra. We should set this up next.

This is a starter project for essential infrastructure templates.
It will help you to get started with the project that is deployed on Cloud Run.

Please fork it.

**Mind that CloudRun expects to serve on the dynamic port number configured by `${PORT}` env variable
So make sure your app is listening on the `${PORT}`**

When forking please name your project corresponding to CloudRun naming conventions, as the service would be created with the same name:  
**Service name may only start with a letter and contain up to 49 lowercase letters, numbers or hyphens**

[Loom walkthrough](https://www.loom.com/share/e244b8ed09bc44de9acd86fed5e78ce1)
