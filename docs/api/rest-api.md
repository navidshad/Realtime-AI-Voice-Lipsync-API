# APIKA REST API Documentation

This document outlines the REST API endpoints provided by the APIKA backend server.

## Base URL

In development: `http://localhost:8080`
In production: Base URL depends on deployment environment

## API Endpoints

### OpenAI Token Generation

Generates an ephemeral token for the OpenAI Realtime API session.

**Endpoint:** `/api/get-token`

**Method:** `GET`

**Query Parameters:**
- `data` (required) - Base64 encoded JSON containing additional setup parameters for the OpenAI session

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/get-token?data=eyJtb2RlbCI6ImdwdC00by1taW5pLXJlYWx0aW1lLXByZXZpZXciLCJ0ZW1wZXJhdHVyZSI6MC42fQ=="
```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2023-06-01T12:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid data parameter
- `500 Internal Server Error` - Error generating token

### Lip Sync Generation

Generates lip sync data from text input.

**Endpoint:** `/lipsinc/generate`

**Method:** `GET`

**Query Parameters:**
- `text` (required) - The text to convert to speech and generate lip sync data
- `options` (optional) - Additional configuration options for the lip sync process

**Example Request:**
```bash
curl -X GET "http://localhost:8080/lipsinc/generate?text=Hello%20world"
```

**Example Response:**
```json
{
  "visemes": ["sil", "PP", "E", "kk", "O", "sil"],
  "vtimes": [0, 100, 200, 300, 400, 500],
  "vdurations": [100, 100, 100, 100, 100, 100],
  "totalDurationInMs": 600,
  "audio": {
    "type": "pcm",
    "encoding": "base64",
    "data": "BASE64_ENCODED_AUDIO_DATA"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing text parameter
- `500 Internal Server Error` - Error in speech generation or lip sync processing

### Generate Lip Sync from Audio File

Generates lip sync data from an uploaded audio file.

**Endpoint:** `/lipsinc/generate-from-file`

**Method:** `POST`

**Content-Type:** `multipart/form-data`

**Request Body:**
- `audio` (required) - Audio file to process (WebM format)
- `text` (optional) - Transcript text to assist with lip sync accuracy

**Example Request:**
```bash
curl -X POST "http://localhost:8080/lipsinc/generate-from-file" \
  -F "audio=@recording.webm" \
  -F "text=Hello world"
```

**Example Response:**
```json
{
  "visemes": ["sil", "PP", "E", "kk", "O", "sil"],
  "vtimes": [0, 100, 200, 300, 400, 500],
  "vdurations": [100, 100, 100, 100, 100, 100],
  "totalDurationInMs": 600
}
```

**Error Responses:**
- `400 Bad Request` - Missing audio file
- `500 Internal Server Error` - Error in audio processing or lip sync generation

## Debug Endpoint

Provides debugging information about the server's file system.

**Endpoint:** `/debug`

**Method:** `GET`

**Example Request:**
```bash
curl -X GET "http://localhost:8080/debug"
```

**Example Response:**
```json
{
  "cwd": "/app",
  "dirname": "/app",
  "files": {
    "dist": ["bundle.js", "index.html"],
    "public": ["index.html", "favicon.ico"],
    "root": ["index.js", "lipsinc.js", "node_modules", "package.json"]
  }
}
```

## API Authentication

Currently, the API endpoints do not require authentication. In production, proper authentication should be implemented using API keys or JWT tokens.

## Rate Limiting

There is currently no rate limiting implemented on the API endpoints. In production, rate limiting should be added to prevent abuse.

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200 OK` - Request successful
- `400 Bad Request` - Missing or invalid parameters
- `500 Internal Server Error` - Server-side processing error

## CORS

CORS is enabled on all API endpoints, allowing cross-origin requests from any origin in development mode. In production, CORS should be configured to allow only specific origins. 